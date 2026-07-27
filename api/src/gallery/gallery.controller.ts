import { Controller, Post, Get, Delete, Param, UseInterceptors, UploadedFile, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { FirebaseAuthGuard } from '../firebase/firebase.guard';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('upload')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Req() req: any
  ) {
    if (req.user?.role !== 'super_admin') {
      throw new UnauthorizedException('Only super admins can upload to gallery');
    }
    if (!file) {
      throw new Error('Image file is required');
    }
    const uploadedBy = req.user?.email || 'super_admin';
    return this.galleryService.uploadImage(file, title, uploadedBy);
  }

  @Get()
  async getImages() {
    return this.galleryService.getImages();
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  async deleteImage(@Param('id') id: string, @Req() req: any) {
    if (req.user?.role !== 'super_admin') {
      throw new UnauthorizedException('Only super admins can delete from gallery');
    }
    return this.galleryService.deleteImage(id);
  }
}
