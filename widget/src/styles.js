import jss from 'jss'
import preset from 'jss-preset-default'

// https://github.com/juliangarnier/anime
// https://tailwindui.com/?ref=top

const variables = {
  lightGrey: 'rgba(51,65,85,.1)',
  middleGrey: 'rgb(248, 250, 252)',
  grey: '#e5e7eb',
  darkTextColor: 'rgb(15, 23, 42)',
  textColor: 'rgb(51, 65, 85)',
  highlight: '#0ac3c5',
  error: '#B71C1C',
}

const inputStyle = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: `2px solid ${variables.lightGrey}`,
  marginBottom: '12px',
  width: '100%',
}

if (process.env.NODE_ENV !== 'test') {
  jss.setup(preset())
}

const styles = {
  '@keyframes shine': {
    to: { backgroundPositionX: '-200%' }
  },
  placeholder: {
    background: variables.grey,
    background: 'linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%)',
    backgroundSize: '200% 100%',
    borderRadius: '64px', // todo small default
    height: '64px',
    width: '64px',
    position: 'relative',
    animation: '1.5s $shine linear infinite',
  },

  container: {
    position: 'relative',
    display: 'flex',
    columnGap: '2em',
    padding: '1em',
    fontFamily: 'Inter var, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
    boxSizing: 'border-box',

    '& *': {
      boxSizing: 'border-box',
    }
  },

  donationCircle: {
    position: 'relative',
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '64px',
    background: variables.grey,
    fontSize: '32px',
    userSelect: 'none',
    color: variables.darkTextColor,
    textDecoration: 'none',

    '& svg': {
      borderRadius: '64px',
    },

    '&:hover $circleTextTop': {
      opacity: '1',
      transform: 'translateY(0%)'
    },

    '&:hover $circleTextBottom': {
      opacity: '1',
      transform: 'translateY(0%)'
    },
  },

  active: {
    '& $circleTextTop': {
      opacity: '1',
      transform: 'translateY(0%)'
    },

    '& $circleTextBottom': {
      opacity: '1',
      transform: 'translateY(0%)'
    }
  },

  circleTextTop: {
    position: 'absolute',
    fontSize: '14px',
    top: '-20px',
    transform: 'translateY(50%)',
    opacity: '0',
    transition: 'ease-in-out all 0.3s'
  },

  circleTextBottom: {
    position: 'absolute',
    fontSize: '12px',
    top: '100%',
    transform: 'translateY(-75%)',
    opacity: '0',
    transition: 'ease-in-out all 0.3s',

    '& svg': {
      width: '14px',
      height: '14px',
    }
  },

  createModal: {
    position: 'absolute',
    display: 'none',
    padding: '10px',
    background: '#fff',
    bottom: '-10px',
    cursor: 'initial',
    width: '280px',
    transform: 'translateY(100%)',
    boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    borderRadius: '5px',
    color: variables.textColor,

    '& h3': {
      color: variables.darkTextColor,
      marginTop: '0',
      fontWeight: '600',
      fontSize: '16px',
      lineHeight: '24px',
    },

    '& button': {
      background: '#fff',
      border: `2px solid ${variables.lightGrey}`,
      cursor: 'pointer',
      borderRadius: '6px',

      '&:hover': {
        background: variables.middleGrey,
      }
    },

    '& label': {
      display: 'block',
      color: variables.darkTextColor,
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '4px',
    },

    '& input': {
      ...inputStyle,

      '&:focus-visible': {
        outline: 'none',
        border: `2px solid ${variables.highlight}`,
      },
    },

    '& input[data-error]': {
      border: `2px solid ${variables.error}`,

      '&+span': {
        display: 'inline-block',
        color: variables.error,
        fontSize: '12px',
        marginTop: '-10px',
        marginBottom: '10px',
      }
    },
  },

  visible: {
    display: 'block',
  },

  hidden: {
    display: 'none',
  },

  createButton: {
    width: '100%',
    padding: '6px 12px',
    background: `${variables.highlight} !important`,
    color: '#fff',
    marginTop: '16px',
  },

  modalCloseButton: {
    position: 'absolute',
    right: '6px',
    top: '6px',
    width: '26px',
    height: '26px',
    borderRadius: '100%',
  },

  buttonGroup: {
    marginBottom: '16px',
    display: 'flex',

    '& > button': {
      borderRadius: '0',
      padding: '12px',
      fontSize: '16px',
      width: '100%',
      borderLeftWidth: '1px',
      borderRightWidth: '1px',
    },

    '& > button:first-child': {
      borderTopLeftRadius: '6px',
      borderBottomLeftRadius: '6px',
      borderLeftWidth: '2px',
    },

    '& > button:last-child': {
      borderTopRightRadius: '6px',
      borderBottomRightRadius: '6px',
      borderRightWidth: '2px',
    }
  },

  activeButton: {
    borderColor: `${variables.highlight} !important`,
    borderWidth: '2px !important',
  },

  imageContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  profileImage: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    overflow: 'hidden',
    cursor: 'pointer',
  },

  profileActive: {
    border: `2px solid ${variables.highlight}`,
  },

  fileInput: {
    display: 'none',
  },

  uploadImage: {
    background: variables.middleGrey,
    display: 'flex !important',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewUploadImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '100%',
  },

  stripeInputContainer: {
    ...inputStyle
  },

  infoLink: {
    margin: '0.5em 0',
    color: variables.textColor,
    fontSize: '0.6em',
    textDecoration: 'underline',
    cursor: 'pointer',
    userSelect: 'none',

    '&:hover': {
      textDecoration: 'none',
      opacity: '0.8',
    }
  },

  circleImage: {
    width: '100%',
    height: '100%',
  }
}

export default process.env.NODE_ENV !== 'test'
  ? jss.createStyleSheet(styles).attach()
  : { classes: Object.keys(styles).reduce((a, v) => ({ ...a, [v]: v}), {})  }
  // maps to object like { button: 'button' ... } for testing purposes
