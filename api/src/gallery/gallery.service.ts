import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { FirebaseService } from '../firebase/firebase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GalleryService {
  private s3Client: S3Client;
  private readonly logger = new Logger(GalleryService.name);
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor(
    private configService: ConfigService,
    private firebaseService: FirebaseService,
  ) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || 'kidlearners';
    this.publicUrl = this.configService.get<string>('R2_PUBLIC_DEV_URL') || 'https://pub-c6e041176ded4edaa77015c26e2e6da0.r2.dev';
    
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  async uploadImage(file: Express.Multer.File, title: string, uploadedBy: string) {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFileName = `gallery/${uuidv4()}.${fileExtension}`;

      // 1. Upload to Cloudflare R2
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: uniqueFileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      // 2. Save metadata to Firestore
      const imageUrl = `${this.publicUrl}/${uniqueFileName}`;
      
      const newDoc = {
        title: title || 'Untitled',
        url: imageUrl,
        r2Key: uniqueFileName,
        uploadedBy,
        createdAt: new Date().toISOString(),
      };

      const docRef = await this.firebaseService.getDb().collection('gallery').add(newDoc);
      
      return { id: docRef.id, ...newDoc };
    } catch (error) {
      this.logger.error(`Failed to upload image: ${error.message}`);
      throw new InternalServerErrorException('Failed to upload image to gallery');
    }
  }

  async getImages() {
    try {
      const snapshot = await this.firebaseService.getDb().collection('gallery').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      this.logger.error(`Failed to fetch images: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch gallery images');
    }
  }

  async deleteImage(id: string) {
    try {
      const docRef = this.firebaseService.getDb().collection('gallery').doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw new NotFoundException('Image not found');
      }

      const data = doc.data();
      
      // 1. Delete from R2
      if (data.r2Key) {
        const command = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: data.r2Key,
        });
        await this.s3Client.send(command);
      }

      // 2. Delete from Firestore
      await docRef.delete();
      
      return { message: 'Image deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete image: ${error.message}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete image');
    }
  }
}
