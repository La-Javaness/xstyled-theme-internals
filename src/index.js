import styled from '@xstyled/styled-components'

/**
 * Applies a theme to the style API provided by a component's source code. The
 * component provides an API in the form of style variables with default values.
 * This function links a component API's values with the definitions found in the
 * theme for the component. The return value is a function that will itself merge
 * theme variables with component default variables and with variables derived
 * from the variant of a component instance. In order to keep this code independant
 * from component implementations, it's the resulting function that receives the
 * component's official API, instead of hardcoding it in th xstyled-theme utils
 * or in themes. Besides, we need props to compute the variants to apply to a
 * component instance, so the resulting function takes props as a second parameter.
 *
 * @param  {Object} componentThemeVars The theme's declarations for the component
 * @param  {Object} componentVariants  Component variants defined in the theme
 * @return {Function} A function that merges all style variables based on a
 * component API and component instance's props.
 */
const mergeThemeVars = (componentThemeVars, componentVariants) => (componentStyleApi, props) => {
	let vars = { ...componentStyleApi, ...componentThemeVars }

	componentVariants
		.filter((variant) => props[variant.prop] !== undefined)
		.forEach((variant) => {
			const varsToInject = variant.variants[props[variant.prop]] || variant.variants[variant.default]
			vars = { ...vars, ...varsToInject }
		})

	return vars
}

/**
 * Generates a factory for xstyled `styled` functions, with theme variables injected
 * as props so they can be used in the xstyled CSS-in-JS body. This function is
 * intended for use by generated code inside xstyled-theme themes. It needs to be
 * instantiated with a component style API provided by the component's developer
 * in order to produce a `styled`-like function with the theme variables injected.
 * @param  {Object} themeVars         The theme variables for a component.
 * @param  {Object} themeVariants     The theme variants for a component.
 * @return {Function} A factory for functions with the same API as xstyled's
 * `styled` function, which can be instantiated by providing a theme API for a
 * component. An implicit constraint must be respected: the component API passed
 * to the factory function must be for the same component as the theme variables
 * and variants passed to this function.
 */
const genStyledFunctionFactory = (themeVars, themeVariants) => (componentStyleApi) => {
	const newStyledFunc = (key) => (...args) => {
		return (styled[key] || styled(key)).attrs((props) =>
			mergeThemeVars(themeVars, themeVariants)(componentStyleApi, props)
		)(...args)
	}

	Object.keys(styled).forEach((key) => {
		newStyledFunc[key] = newStyledFunc(key)
	})

	return newStyledFunc
}

export default genStyledFunctionFactory
