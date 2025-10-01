import React, { useRef, useState } from "react";
import "./AudioPlayer.css";

interface AudioPlayerProps {
  src: string;
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = (): void => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleDownload = () => {
    if (src) {
      const link = document.createElement("a");
      link.href = src;
      link.download = "record.mp3";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration > 0) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const hoverTimeValue = (clickX / rect.width) * duration;
      setHoverTime(hoverTimeValue);
      setIsHovering(true);
    }
  };

  const handleProgressLeave = () => {
    setIsHovering(false);
    setHoverTime(null);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickTime = (clickX / rect.width) * duration;

      audioRef.current.currentTime = clickTime;
      setCurrentTime(clickTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <span className="audio-duration">{formatTime(duration)}</span>

      <button
        className={`play-button ${isPlaying ? "playing" : ""}`}
        onClick={handlePlayPause}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>

      <div
        className="progress-bar"
        onMouseMove={handleProgressHover}
        onMouseLeave={handleProgressLeave}
        onClick={handleProgressClick}
      >
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
        {isHovering && hoverTime !== null && (
          <div
            className="hover-time"
            style={{ left: `${(hoverTime / duration) * 100}%` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>

      <div className="download-button" onClick={handleDownload}>
        <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
          <path
            d="M7 0L7 11M7 11L11 7M7 11L3 7"
            stroke="#002CFB"
            strokeWidth="2"
          />
          <path d="M1 16H13" stroke="#002CFB" strokeWidth="2" />
        </svg>
      </div>

      <div className="close-button" onClick={onClose}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="#ADBFDF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
};

export default AudioPlayer;
