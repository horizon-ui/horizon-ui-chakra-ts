// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Navbar from 'components/navbar/NavbarRTL';
import Sidebar from 'components/sidebar/Sidebar';
import { RtlProvider } from 'components/rtlProvider/RtlProvider';
import { SidebarContext } from 'contexts/SidebarContext';
import { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from 'routes';

// Custom Chakra theme
export default function Dashboard(props: { [x: string]: any }) {
	const { ...rest } = props;
	// states and functions
	const [ fixed ] = useState(false);
	const [ toggleSidebar, setToggleSidebar ] = useState(false);
	// functions for changing the states from components
	const getRoute = () => {
		return window.location.pathname !== '/rtl/full-screen-maps';
	};
	const getActiveRoute = (routes: RoutesType[]): string => {
		let activeRoute = 'Default Brand Text';
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].name;
			}
		}
		return activeRoute;
	};
	const getActiveNavbar = (routes: RoutesType[]): boolean => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].secondary;
			}
		}
		return activeNavbar;
	};
	const getActiveNavbarText = (routes: RoutesType[]): string | boolean => {
		let activeNavbar = false;
		for (let i = 0; i < routes.length; i++) {
			if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].name;
			}
		}
		return activeNavbar;
	};
	const getRoutes = (routes: RoutesType[]): any => {
		return routes.map((route: RoutesType, key: any) => {
			if (route.layout === '/rtl') {
				return <Route path={route.layout + route.path} component={route.component} key={key} />;
			} else {
				return null;
			}
		});
	};
	document.documentElement.dir = 'rtl';
	const { onOpen } = useDisclosure();
	return (
		<RtlProvider>
			<SidebarContext.Provider
				value={{
					toggleSidebar,
					setToggleSidebar
				}}>
				<Sidebar routes={routes} display='none' {...rest} />
				<Box
					float='left'
					minHeight='100vh'
					height='100%'
					overflow='auto'
					position='relative'
					maxHeight='100%'
					w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
					maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
					transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
					transitionDuration='.2s, .2s, .35s'
					transitionProperty='top, bottom, width'
					transitionTimingFunction='linear, linear, ease'>
					<Portal>
						<Box>
							<Navbar
								onOpen={onOpen}
								logoText={'Horizon UI Dashboard'}
								brandText={getActiveRoute(routes)}
								secondary={getActiveNavbar(routes)}
								message={getActiveNavbarText(routes)}
								fixed={fixed}
								{...rest}
							/>
						</Box>
					</Portal>

					{getRoute() ? (
						<Box mx='auto' p={{ base: '20px', md: '30px' }} pe='20px' minH='100vh' pt='50px'>
							<Switch>
								{getRoutes(routes)}
								<Redirect from='/' to='/rtl/rtl-default' />
							</Switch>
						</Box>
					) : null}
					<Box>
						<Footer />
					</Box>
				</Box>
			</SidebarContext.Provider>
		</RtlProvider>
	);
}
