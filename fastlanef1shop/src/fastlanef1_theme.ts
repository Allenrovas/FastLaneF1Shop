// You can also use the generator at https://skeleton.dev/docs/generator to create these values for you
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';
export const fastlanef1_theme: CustomThemeConfig = {
	name: 'fastlanef1_theme',
	properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": "system-ui",
		"--theme-font-family-heading": "'Orbitron', 'Rajdhani', system-ui", // Fuentes más racing/tech
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "12px", // Más moderno que pill completo
		"--theme-rounded-container": "16px",
		"--theme-border-base": "2px", // Bordes más gruesos para impacto visual
		
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0", // Negro sobre verde racing
		"--on-secondary": "255 255 255", // Blanco sobre azul racing
		"--on-tertiary": "0 0 0", // Negro sobre naranja F1
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0", 
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		
		// =~= Theme Colors =~=
		// primary | #00D2AA - Verde Racing Mejorado (más vibrante)
		"--color-primary-50": "204 248 242", // #ccf8f2
		"--color-primary-100": "179 246 237", // #b3f6ed
		"--color-primary-200": "153 243 233", // #99f3e9
		"--color-primary-300": "102 236 219", // #66ecdb
		"--color-primary-400": "51 222 192", // #33dec0
		"--color-primary-500": "0 210 170", // #00D2AA
		"--color-primary-600": "0 189 153", // #00bd99
		"--color-primary-700": "0 158 128", // #009e80
		"--color-primary-800": "0 126 102", // #007e66
		"--color-primary-900": "0 103 83", // #006753

		// secondary | #FF6B35 - Naranja F1 (como McLaren/Red Bull)
		"--color-secondary-50": "255 233 225", // #ffe9e1
		"--color-secondary-100": "255 225 214", // #ffe1d6
		"--color-secondary-200": "255 218 204", // #ffdacc
		"--color-secondary-300": "255 195 173", // #ffc3ad
		"--color-secondary-400": "255 150 112", // #ff9670
		"--color-secondary-500": "255 107 53", // #FF6B35
		"--color-secondary-600": "230 96 48", // #e66030
		"--color-secondary-700": "191 80 40", // #bf5028
		"--color-secondary-800": "153 64 32", // #994020
		"--color-secondary-900": "125 52 26", // #7d341a

		// tertiary | #0066FF - Azul F1 Eléctrico
		"--color-tertiary-50": "204 229 255", // #cce5ff
		"--color-tertiary-100": "179 217 255", // #b3d9ff
		"--color-tertiary-200": "153 204 255", // #99ccff
		"--color-tertiary-300": "102 178 255", // #66b2ff
		"--color-tertiary-400": "51 122 255", // #337aff
		"--color-tertiary-500": "0 102 255", // #0066FF
		"--color-tertiary-600": "0 92 230", // #005ce6
		"--color-tertiary-700": "0 77 191", // #004dbf
		"--color-tertiary-800": "0 61 153", // #003d99
		"--color-tertiary-900": "0 50 125", // #00327d

		// success | #39FF14 - Verde Neón Racing
		"--color-success-50": "225 255 220", // #e1ffdc
		"--color-success-100": "214 255 208", // #d6ffd0
		"--color-success-200": "204 255 197", // #ccffc5
		"--color-success-300": "174 255 162", // #aeffa2
		"--color-success-400": "113 255 92", // #71ff5c
		"--color-success-500": "57 255 20", // #39FF14
		"--color-success-600": "51 230 18", // #33e612
		"--color-success-700": "43 191 15", // #2bbf0f
		"--color-success-800": "34 153 12", // #22990c
		"--color-success-900": "28 125 10", // #1c7d0a

		// warning | #FFD700 - Oro F1 Championship
		"--color-warning-50": "255 249 204", // #fff9cc
		"--color-warning-100": "255 247 179", // #fff7b3
		"--color-warning-200": "255 244 153", // #fff499
		"--color-warning-300": "255 237 102", // #ffed66
		"--color-warning-400": "255 223 51", // #ffdf33
		"--color-warning-500": "255 215 0", // #FFD700
		"--color-warning-600": "230 194 0", // #e6c200
		"--color-warning-700": "191 161 0", // #bfa100
		"--color-warning-800": "153 129 0", // #998100
		"--color-warning-900": "125 105 0", // #7d6900

		// error | #FF0040 - Rojo F1 Ferrari Intenso  
		"--color-error-50": "255 204 225", // #ffcce1
		"--color-error-100": "255 179 214", // #ffb3d6
		"--color-error-200": "255 153 204", // #ff99cc
		"--color-error-300": "255 102 173", // #ff66ad
		"--color-error-400": "255 51 112", // #ff3370
		"--color-error-500": "255 0 64", // #FF0040
		"--color-error-600": "230 0 58", // #e6003a
		"--color-error-700": "191 0 48", // #bf0030
		"--color-error-800": "153 0 38", // #990026
		"--color-error-900": "125 0 31", // #7d001f

		// surface | #1A1A2E - Azul Oscuro Racing (fondo premium)
		"--color-surface-50": "221 221 233", // #dddde9
		"--color-surface-100": "209 209 226", // #d1d1e2
		"--color-surface-200": "198 198 218", // #c6c6da
		"--color-surface-300": "163 163 196", // #a3a3c4
		"--color-surface-400": "94 94 151", // #5e5e97
		"--color-surface-500": "26 26 46", // #1A1A2E
		"--color-surface-600": "23 23 41", // #171729
		"--color-surface-700": "20 20 35", // #141423
		"--color-surface-800": "16 16 28", // #10101c
		"--color-surface-900": "13 13 23", // #0d0d17
	}
};