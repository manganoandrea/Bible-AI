import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

type AudioStatus = "pending" | "generating" | "ready" | "failed";

interface UseStoryAudioProps {
  audioUrl: string | undefined;
  audioStatus: AudioStatus | undefined;
  autoPlay?: boolean;
}

interface UseStoryAudioReturn {
  isPlaying: boolean;
  isLoaded: boolean;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  replay: () => Promise<void>;
}

export function useStoryAudio({
  audioUrl,
  audioStatus,
  autoPlay = true,
}: UseStoryAudioProps): UseStoryAudioReturn {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAudio() {
      // Only load if we have a valid URL and status is ready
      if (!audioUrl || audioStatus !== "ready") {
        return;
      }

      try {
        // Configure audio mode for playback
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        // Unload previous sound if exists
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: autoPlay }
        );

        if (!isMounted) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        setIsLoaded(true);
        setIsPlaying(autoPlay);

        // Listen for playback status updates
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        });
      } catch (error) {
        console.error("Failed to load audio:", error);
        setIsLoaded(false);
        setIsPlaying(false);
      }
    }

    loadAudio();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [audioUrl, audioStatus, autoPlay]);

  const play = async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
    }
  };

  const pause = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
    }
  };

  const replay = async () => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(0);
      await soundRef.current.playAsync();
    }
  };

  return { isPlaying, isLoaded, play, pause, replay };
}
