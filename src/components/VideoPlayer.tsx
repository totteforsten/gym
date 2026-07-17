"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { youtubeSearchUrl, youtubeThumb } from "@/lib/utils";

export function VideoPlayer({
  videoId,
  name,
}: {
  videoId: string;
  name: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-video w-full bg-gradient-to-br from-[#141722] to-[#0a0b10]">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`Play video for ${name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={youtubeThumb(videoId)}
              alt={name}
              className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            <div className="absolute inset-0 grid place-items-center bg-black/30">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-[rgba(139,92,246,0.92)] shadow-2xl shadow-[rgba(139,92,246,0.6)] transition-transform group-hover:scale-110">
                <Play className="h-9 w-9 translate-x-[2px] fill-white text-white" />
              </span>
            </div>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="text-xs text-[var(--color-muted)]">
          Video demonstration · tap to play
        </p>
        <a
          href={youtubeSearchUrl(name)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] transition-colors hover:text-white"
        >
          More on YouTube <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
