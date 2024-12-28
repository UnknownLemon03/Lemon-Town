'use client';

import {
  Chat,
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';

import '@livekit/components-styles';

import { useEffect, useRef, useState } from 'react';
import { Track } from 'livekit-client';
import { Display } from 'phaser';
import { LoaderIcon } from 'react-hot-toast';
import Loading from '@/app/loading';
export default function VideoCall({onDisconnected,MeetingToken}:{onDisconnected:()=>undefined,MeetingToken:string}) {
  

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={MeetingToken}
      onDisconnected={onDisconnected}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL as string}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100vh',position: 'absolute' ,top:"0",left:"0"}}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    //@ts-ignore
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
