'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Loader2,
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DishImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  dishName?: string;
}

const PRESET_IMAGES = [
  { name: 'Margherita D.O.P.', src: '/images/pizza-margherita.jpg' },
  { name: 'Diavola Spianata', src: '/images/pizza-diavola.jpg' },
  { name: 'Gialla & Datterini', src: '/images/pizza-gialla.jpg' },
  { name: 'Quattro Formaggi', src: '/images/pizza-formaggi.jpg' },
];

export function DishImageUpload({
  value,
  onChange,
  label = 'Gerichtsfoto / Produktbild',
  dishName = 'Gericht',
}: DishImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);

  // Instant local preview
  const [localPreview, setLocalPreview] = useState<string>(value || '');

  // Keep local preview in sync when value changes externally
  React.useEffect(() => {
    if (value && value !== localPreview && !localPreview.startsWith('data:')) {
      setLocalPreview(value);
    }
  }, [value, localPreview]);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Bitte wählen Sie eine gültige Bilddatei aus (JPG, PNG, WEBP).');
      return;
    }

    // Validate size (10 MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Die Datei ist zu groß (maximal 10 MB erlaubt).');
      return;
    }

    setErrorMessage(null);
    setUploadSuccess(false);

    // 1. INSTANT LIVE PREVIEW via FileReader (0ms delay)
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setLocalPreview(dataUrl);
        // Fallback value immediately so form has something
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);

    // 2. AUTO-SAVE TO BACKEND STORAGE
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        setLocalPreview(data.url);
        onChange(data.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 5000);
      } else {
        // Keep dataUrl preview, but warn
        setErrorMessage(data.error || 'Server-Upload nicht abgeschlossen. Lokale Vorschau bleibt aktiv.');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMessage('Verbindung zum Upload-Server fehlgeschlagen. Lokale Bildvorschau bleibt erhalten.');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setLocalPreview('');
    onChange('');
    setErrorMessage(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentDisplayImage = localPreview || value;

  return (
    <div className="space-y-2.5">
      {/* Label and Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
          {label}
        </label>
        {currentDisplayImage && (
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Vorschau aktiv
          </span>
        )}
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* 1. If Image is Selected: LIVE PREVIEW CARD */}
      {currentDisplayImage ? (
        <div className="relative rounded-2xl border-2 border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 overflow-hidden shadow-xs transition-all">
          {/* Main Visual Preview Area */}
          <div className="relative w-full h-44 sm:h-48 bg-stone-900 overflow-hidden group">
            {/* Background blur highlight */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentDisplayImage}
              alt={dishName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Gradient Overlay for controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
              {/* Top status pills */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold border border-white/10">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Live-Vorschau</span>
                </div>

                {isUploading ? (
                  <div className="flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold shadow-md animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Speichert im Backend...</span>
                  </div>
                ) : uploadSuccess ? (
                  <div className="flex items-center gap-1.5 bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold shadow-md">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Im Backend gespeichert!</span>
                  </div>
                ) : null}
              </div>

              {/* Bottom bar inside preview with quick actions */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <div className="text-[10px] text-stone-200 font-mono truncate max-w-[200px] sm:max-w-[260px] bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {currentDisplayImage.startsWith('data:') ? 'Neues Bild hochgeladen' : currentDisplayImage}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={triggerSelect}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1 bg-white/90 hover:bg-white text-stone-900 text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isUploading ? 'animate-spin' : ''}`} />
                    <span>Anderes Bild</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isUploading}
                    className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    title="Bild entfernen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. If NO Image is Selected: DROPZONE & UPLOAD BUTTON */
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={triggerSelect}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 group ${
            isDragging
              ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 scale-[1.01]'
              : 'border-stone-300 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-900/40 hover:border-red-400 dark:hover:border-red-500/60 hover:bg-stone-100/70 dark:hover:bg-stone-900/80'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200">
                <span className="text-red-600 dark:text-red-400 underline decoration-red-400/50 underline-offset-2">
                  Klicken zum Auswählen
                </span>{' '}
                oder Bild hierher ziehen
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                JPG, PNG, WEBP oder AVIF (max. 10 MB)
              </p>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-400 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700 mt-1">
              ⚡ Sofortige Vorschau &amp; automatische Speicherung im Backend
            </span>
          </div>
        </div>
      )}

      {/* Error message if any */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick Preset Selection */}
      <div className="pt-1">
        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
          <span className="font-semibold text-stone-600 dark:text-stone-400">
            Oder Napoli-Standardbild wählen:
          </span>
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showManualInput ? 'URL ausblenden' : 'URL eingeben'}</span>
            {showManualInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Preset mini thumbnails */}
        <div className="grid grid-cols-4 gap-2">
          {PRESET_IMAGES.map((preset) => {
            const isSelected = currentDisplayImage === preset.src;
            return (
              <button
                key={preset.src}
                type="button"
                onClick={() => {
                  setLocalPreview(preset.src);
                  onChange(preset.src);
                  setErrorMessage(null);
                }}
                className={`group relative rounded-xl border p-1 text-left transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-red-600 bg-red-50 dark:bg-red-950/40 ring-1 ring-red-600'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400'
                }`}
              >
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preset.src}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-[9.5px] font-bold text-stone-700 dark:text-stone-300 truncate">
                  {preset.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Manual URL input */}
      {showManualInput && (
        <div className="pt-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={currentDisplayImage.startsWith('data:') ? '' : currentDisplayImage}
              onChange={(e) => {
                const val = e.target.value;
                setLocalPreview(val);
                onChange(val);
              }}
              placeholder="https://... oder /images/pizza-margherita.jpg"
              className="text-xs h-9"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerSelect}
              className="h-9 text-xs shrink-0 cursor-pointer"
            >
              Datei suchen
            </Button>
          </div>
          <p className="text-[10px] text-stone-400 font-mono">
            Externe Bild-URL (Unsplash, CDN) oder relativer Pfad aus dem public-Verzeichnis.
          </p>
        </div>
      )}
    </div>
  );
}
