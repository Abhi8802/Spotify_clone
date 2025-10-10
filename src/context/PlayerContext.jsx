import { useRef, createContext, useState, useEffect } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);

    const [time, setTime] = useState({
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 }
    });

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    };

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    };
    const playWithId= async (id) =>{
        await setTrack(songsData[id]);
        await audioRef.current.play();
        setPlayStatus(true);
    }
    const previous = async () => {
        if (track.id>0) {
            await setTrack(songsData[track.id-1]);
            await audioRef.current.play()
            setPlayStatus(true);
        }
    }
    const next = async () => {
        if (track.id< songsData.length-1) {
            await setTrack(songsData[track.id+1]);
            await audioRef.current.play()
            setPlayStatus(true);
        }
    }
    const seekSong = async (e) => {
    if (!audioRef.current || !seekBg.current) return;

    const clickPosition = e.nativeEvent.offsetX;
    const barWidth = seekBg.current.offsetWidth;
    const duration = audioRef.current.duration;

    audioRef.current.currentTime = (clickPosition / barWidth) * duration;
};


    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => {
            seekBar.current.style.width = (Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%";
            setTime({
                currentTime: {
                    second: Math.floor(audio.currentTime % 60),
                    minute: Math.floor(audio.currentTime / 60)
                },
                totalTime: {
                    second: Math.floor(audio.duration % 60),
                    minute: Math.floor(audio.duration / 60)
                }
            });
        };
        

        if (audio) {
            audio.ontimeupdate = updateTime;
        }

        return () => {
            if (audio) {
                audio.ontimeupdate = null;
            }
        };
    }, []); 

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong

    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
