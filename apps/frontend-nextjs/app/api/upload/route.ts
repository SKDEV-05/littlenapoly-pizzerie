import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei übermittelt' }, { status: 400 });
    }

    // Verify it's an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Nur Bilddateien (JPG, PNG, WEBP) sind erlaubt' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Generate safe unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanExt = ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext) ? ext : 'jpg';
    const safeName = `pizza_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${cleanExt}`;
    const filePath = path.join(uploadDir, safeName);

    // Save image to frontend public directory
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;

    // Also attempt saving into Laravel backend public storage if online
    try {
      const rawBackend = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
      const backendUrl = rawBackend.replace(/\/api\/v1$/, '');
      const laravelFormData = new FormData();
      laravelFormData.append('image', new Blob([buffer], { type: file.type }), safeName);
      
      await fetch(`${backendUrl}/api/v1/menu/upload`, {
        method: 'POST',
        body: laravelFormData,
      }).catch(() => {
        // Silent fallback if Laravel backend is offline
      });
    } catch {
      // Backend optional
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeName,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error?.message || 'Fehler beim Hochladen' }, { status: 500 });
  }
}
