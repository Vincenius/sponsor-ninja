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
  padding: '10px 16px',
  borderRadius: '6px',
  border: `2px solid ${variables.lightGrey}`,
  marginBottom: '12px',
  width: '100%',
  fontSize: '16px',
}

const styles = {
  '@keyframes shine': {
    to: { backgroundPositionX: '-200%' }
  },
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0)',
      animationTimingFunction: 'cubic-bezier(.55,.055,.675,.19)',
    },
    '50%': {
      transform: 'rotate(180deg)',
      animationTimingFunction: 'cubic-bezier(.215,.61,.355,1)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
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
    justifyContent: 'center',
    textAlign: 'left',
    columnGap: '2em',
    rowGap: '1.5em',
    flexWrap: 'wrap',
    padding: '1em',
    fontFamily: 'Inter var, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
    boxSizing: 'border-box',

    '& *': {
      boxSizing: 'border-box',
    }
  },

  newDonation: {
    cursor: 'pointer',
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

    '&:after': {
      content: '""',
      position: 'absolute',
      width: 'calc(100% + 6px)',
      height: 'calc(100% + 6px)',
      top: '-3px',
      left: '-3px',
      zIndex: '-1',
      background: 'transparent',
      borderRadius: '100%',
    },

    '&[data-amount="5"]:after': {
      background: 'linear-gradient(132deg, rgb(251, 251, 255) 0.00%, rgb(215, 223, 252) 100.00%)',
    },

    '&[data-amount="10"]:after': {
      background: 'linear-gradient(135deg,#ADB2B4 0%,#44464A 135%)',
    },

    '&[data-amount="25"]:after': {
      background: 'linear-gradient(132deg, rgb(31, 207, 195) 0.00%, rgb(31, 145, 207) 100.00%)',
    },

    '&[data-amount="50"]:after': {
      background: 'linear-gradient(132deg, rgb(241, 242, 11) 0.00%, rgb(248, 161, 27) 100.00%)',
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
    padding: '16px',
    background: '#fff',
    bottom: '-10px',
    cursor: 'initial',
    width: '280px',
    transform: 'translateY(100%)',
    boxShadow: '0 8px 30px 10px rgba(0,0,0,.25),0 2px 10px rgba(0,0,0,.25)',
    borderRadius: '16px',
    color: variables.textColor,
    zIndex: '1000',

    '& h3': {
      color: variables.darkTextColor,
      marginTop: '0',
      fontWeight: '600',
      fontSize: '25px',
    },

    '& button': {
      background: '#fff',
      border: `2px solid ${variables.lightGrey}`,
      cursor: 'pointer',
      borderRadius: '6px',

      '&:hover': {
        background: variables.middleGrey,
      },
    },

    '& label': {
      display: 'block',
      color: variables.darkTextColor,
      fontSize: '16px',
      fontWeight: '400',
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

  topModal: {
    bottom: '110px',
    transform: 'translateY(0)',
  },

  visible: {
    display: 'block',
  },

  hidden: {
    display: 'none',
  },

  createButton: {
    width: '100%',
    padding: '10px 14px',
    background: `${variables.highlight} !important`,
    color: '#fff',
    marginTop: '16px',
    fontSize: '16px'
  },

  loadingButton: {
    position: 'relative',
    opacity: '0.7',
    cursor: 'pointer',

    '&:after': {
      position: 'absolute',
      margin: 'auto',
      content: '" "',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      borderWidth: '.25em',
      borderColor: 'currentColor currentColor currentColor transparent',
      borderStyle: 'solid',
      marginLeft: '6px',
      animation: '$spin 1s infinite'
    }
  },

  modalCloseButton: {
    position: 'absolute',
    right: '6px',
    top: '6px',
    width: '26px',
    height: '26px',
    borderRadius: '100% !important',
    fontWeight: 'bold',
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
    background: `${variables.highlight} !important`,
    color: '#fff',
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

  info: {
    margin: '0.5em 0',
    color: variables.textColor,
    fontSize: '12px',

    '& a': {
      color: variables.textColor,
    },

    '& a:hover': {
      textDecoration: 'none',
      opacity: '0.8',
    }
  },

  infoLink: {
    margin: '0.5em 0',
    color: variables.textColor,
    fontSize: '10px',
    textDecoration: 'underline',
    cursor: 'pointer',
    userSelect: 'none',

    '&:hover': {
      textDecoration: 'none',
      opacity: '0.8',
    }
  },

  circleImage: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  successEmoji: {
    fontSize: '4em',
    textAlign: 'center',
    display: 'inline-block',
    width: '100%',
  },

  error: {
    color: variables.error,
  },

  highlightText: {
    borderBottom: `3px solid ${variables.highlight}`,
  },
}

export default styles
