import ControlPanel from "@/components/listMusicPlayer/ControlPanel";
import PlayerSlider from "@/components/listMusicPlayer/PlayerSlider";
import { Common } from "@/styles/common";
import styled from "@emotion/styled";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
	ChangeEvent,
	SyntheticEvent,
	useEffect,
	useRef,
	useState,
} from "react";

interface WidthProps {
	showable?: boolean;
}

const PalyerContainer = styled.div<WidthProps>`
	width: auto;
	min-width: ${(props) => (props.showable ? "600px;" : "65px")};
	overflow: hidden;
	padding: ${Common.space.spacingMd};
	display: flex;
	flex-flow: row wrap;
	gap: 10px;
	align-items: center;
	flex: ${(props) => (props.showable ? "1" : "0")};
	position: relative;
`;

const PlayButton = styled.button`
	background-color: transparent;
	border: none;
`;

function MusicPlayer({ src, showable }: { src: string; showable?: boolean }) {
	const [percentage, setPercentage] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);

	const audioRef = useRef(null);

	const audio = audioRef.current! as HTMLAudioElement;

	function onChange(e: ChangeEvent<HTMLInputElement>) {
		const target = e.target as HTMLInputElement;
		audio.currentTime = (audio.duration / 100) * parseInt(target.value);
		setPercentage(parseInt(target.value));
	}

	function handlePlayAndPauseMusic() {
		audio.volume = 0.1;

		if (!isPlaying) {
			setIsPlaying(true);
			audio.play();
		}

		if (isPlaying) {
			setIsPlaying(false);
			audio.pause();
		}
	}

	function getCurrentDuration(e: SyntheticEvent<HTMLAudioElement>) {
		const percent = (
			(e.currentTarget.currentTime / e.currentTarget.duration) *
			100
		).toFixed(2);
		const time = e.currentTarget.currentTime;

		setPercentage(+percent);
		setCurrentTime(parseInt(time.toFixed(2)));
	}

	useEffect(() => {
		if (percentage === 100) {
			setTimeout(() => {
				setIsPlaying(false);
				setPercentage(0);
				audio.currentTime = 0;
			}, 1000);
		}
	}, [percentage]);

	return (
		<PalyerContainer showable={showable}>
			<PlayButton onClick={handlePlayAndPauseMusic}>
				{isPlaying ? (
					<PauseIcon fontSize="large" />
				) : (
					<PlayArrowIcon fontSize="large" />
				)}
			</PlayButton>
			<PlayerSlider
				onChange={onChange}
				percentage={percentage}
				showable={showable}
			/>
			<audio
				ref={audioRef}
				onTimeUpdate={getCurrentDuration}
				onLoadedData={(e) => {
					setDuration(+e.currentTarget.duration.toFixed(2));
				}}
				src={src}
			/>
			<ControlPanel
				duration={duration}
				currentTime={currentTime}
				showable={showable}
			/>
		</PalyerContainer>
	);
}

export default MusicPlayer;
