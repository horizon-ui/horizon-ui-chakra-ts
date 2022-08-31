import { Box } from '@chakra-ui/react';

export const renderTrack = ({ ...props }) => {
	const trackStyle = {
		position: 'absolute',
		maxWidth: '100%',
		width: 6,
		transition: 'opacity 200ms ease 0s',
		opacity: 0,
		background: 'transparent',
		bottom: 2,
		top: 2,
		borderRadius: 3,
		right: 0
	} as const;
	return <div style={ trackStyle } {...props} />;
};
export const renderThumb = ({  ...props }) => {
	const thumbStyle = {
		borderRadius: 15,
		background: 'rgba(222, 222, 222, .1)'
	} as const
	return <div style={ thumbStyle } {...props} />;
};
export const renderView = ( ) => {
	const viewStyle = {
		marginBottom: -22
	}as const;
	return (
		<Box height="100%" me={{ base: '0px !important', lg: '-16px !important' }} style={ viewStyle }   />
	);
};
