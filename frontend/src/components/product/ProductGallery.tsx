"use client";

import { useState } from "react";
import { Expand, X } from "lucide-react";
import type { WooImage } from "@/lib/types";
import ProductImage from "./ProductImage";

/** Gallery with thumbnail strip and a zoom lightbox. */
export default function ProductGallery({
  images,
  name,
  seed,
}: {
  images: WooImage[];
  name: string;
  seed: number;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const list = images.length ? images : [{ id: 0, src: "", name, alt: name }];
  const current = list[active] ?? list[0];

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoom(true)}
        className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-gray-100 bg-white"
        aria-label="Zoom image"
      >
        <ProductImage src={current.src} alt={current.alt || name} seed={seed} sizes="(max-width: 768px) 100vw, 50vw" priority />
        <span className="absolute right-3 top-3 rounded-full bg-navy/70 p-2 text-white opacity-0 transition group-hover:opacity-100">
          <Expand className="h-4 w-4" />
        </span>
      </button>

      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === active ? "border-brand" : "border-gray-200"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <ProductImage src={img.src} alt={img.alt || name} seed={seed + i} sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-4"
          onClick={() => setZoom(false)}
        >
          <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white" aria-label="Close zoom">
            <X className="h-6 w-6" />
          </button>
          <div className="relative aspect-square w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <ProductImage src={current.src} alt={current.alt || name} seed={seed} sizes="90vw" />
          </div>
        </div>
      )}
    </div>
  );
}
