
import React, { useEffect } from 'react';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';

interface VideoDemoProps {
    /** Bundled video module (from data/exerciseVideos.ts registry). */
    source: number;
    height?: number;
}

/**
 * Looping muted demo video for an exercise (pre-rendered mocap loop).
 * Autoplays on mount; no controls — it behaves like a living illustration,
 * matching the 3D demo hero it replaces when a video asset exists.
 */
export const VideoDemo = ({ source, height = 320 }: VideoDemoProps) => {
    const player = useVideoPlayer(source, p => {
        p.loop = true;
        p.muted = true;
        p.play();
    });

    // On web the play() issued in the setup callback can race the <video>
    // element becoming ready and get dropped — re-issue it once the player
    // reports readyToPlay.
    const { status } = useEvent(player, 'statusChange', { status: player.status });
    useEffect(() => {
        if (status === 'readyToPlay' && !player.playing) {
            player.play();
        }
    }, [status, player]);

    return (
        <VideoView
            player={player}
            style={{ width: '100%', height }}
            contentFit="cover"
            nativeControls={false}
        />
    );
};
