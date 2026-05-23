export const authTheme = {
  name: 'bucket-list-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#fff3e0',
          20: '#ffe0b2',
          40: '#ffb74d',
          60: '#fb8c00',
          80: '#e65100',
          90: '#bf360c',
          100: '#bf360c',
        },
      },
    },
    components: {
      authenticator: {
        router: {
          borderWidth: '0',
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
      button: {
        primary: {
          backgroundColor: '#fb8c00',
          color: 'white',
          _hover: {
            backgroundColor: '#e65100',
          },
        },
        link: {
          color: '#fb8c00',
        },
      },
      fieldcontrol: {
        borderColor: '#ffb74d',
        _focus: {
          borderColor: '#fb8c00',
          boxShadow: '0 0 0 2px rgba(251, 140, 0, 0.3)',
        },
      },
      tabs: {
        item: {
          color: '#fb8c00',
          _active: {
            color: '#e65100',
            borderColor: '#fb8c00',
          },
        },
      },
    },
  },
}