import { Controller, Post, Get, Delete, Param, UseInterceptors, UploadedFile, Body, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('upload')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('super_admin') // Only super admins can upload
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Req() req: any
  ) {
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
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('super_admin') // Only super admins can delete
  async deleteImage(@Param('id') id: string) {
    return this.galleryService.deleteImage(id);
  }
}
