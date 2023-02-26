import styled from 'styled-components';
import { MutatingDots } from 'react-loader-spinner';

function Loading() {
	return (
		<LoadingStyle>
			<MutatingDots
				height='100'
				width='100'
				color='#FFFFFF'
				secondaryColor='#FFFFFF'
				ariaLabel='loading'
				radius={12}
			/>
		</LoadingStyle>
	);
}

const LoadingStyle = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
`;

export default Loading;
