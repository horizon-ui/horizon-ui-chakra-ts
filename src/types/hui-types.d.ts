export {};

declare global {
	/**
   * Now declare things that go in the global namespace,
   * or augment existing declarations in the global namespace.
   */
	interface RoutesType {
		name: string;
		layout: string;
		component: () => JSX.Element;
		icon: JSX.Element | string;
		path: string;
		secondary?: boolean;
	}
}
