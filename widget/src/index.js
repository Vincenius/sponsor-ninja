import jss from 'jss'
import preset from 'jss-preset-default'

import CircleType from 'circletype'
import { createAvatar } from '@dicebear/core'
import { funEmoji, identicon, initials } from '@dicebear/collection'
import party from 'party-js'

import styles from './styles.js'
import { isValidUrl, getRandomInt, getResizedImage } from './utils.js'
import { uploadIcon } from './svgs.js'

let container
let sponsorNinjaProjectId
let sponsorNinjaClientSecret
let loading = false
let stripe
let widgetState = 1 // 1 = basic data, 2 = payment data
let classes
const random = getRandomInt(10000)

const avatar1 = createAvatar(funEmoji, { seed: random })
const avatar2 = createAvatar(identicon, { seed: random })
const avatar3 = createAvatar(initials, { seed: 'Anonymous' })

let sponsorNinjaCardNumber
let sponsorNinjaCardExpiry
let sponsorNinjaCardCvc

const images = [
  avatar1,
  avatar2,
  avatar3,
]

const values = {
  amount: 10,
  name: 'Anonymous',
  website: null,
  image: 0,
  file: '',
}

const updateCircleText = wrapper => {
  const circleTypeTop = new CircleType(wrapper.querySelector(`.${classes.circleTextTop}`))
  circleTypeTop.radius(50)
  const circleTypeBottom = new CircleType(wrapper.querySelector(`.${classes.circleTextBottom}`))
  circleTypeBottom.radius(50).dir(-1)
}

const previewCircle = ({ name, image = 0, website }) => {
  const imageValue = image !== 3
    ? images[image].toString()
    : images[image]

  const preview = getDonationCircle({ name, image: imageValue, website })
  preview.id = 'sponsor-ninja-preview'
  preview.classList.add(classes.active)

  return preview
}

const getDonationCircle = ({ name, website, image, amount = '10' }) => {
  const preview = document.createElement('a')

  preview.classList.add(classes.donationCircle)
  let bottomText = ''

  if (website) {
    preview.href = website
    preview.target = '_blank'
    preview.rel = 'noopener noreferrer'
    bottomText = `visit 🔗 `
  }

  preview.dataset.amount = amount
  preview.innerHTML = `
    <span class="${classes.circleImage}" id="sponsor-ninja-preview-image">${image}</span>
    <span class="${classes.circleTextTop}">${name}</span>
    <span class="${classes.circleTextBottom}">${bottomText}</span>`

  return preview
}

const handleNameChange = e => {
  const value = e.target.value || 'Anonymous'
  const preview = document.querySelector(`#sponsor-ninja-preview`)
  const previewName = preview.querySelector(`.${classes.circleTextTop}`)

  previewName.innerHTML = value
  updateCircleText(preview)

  const newInitials = createAvatar(initials, { seed: value })
  const newAvatar = newInitials
  images[2] = newInitials

  document.querySelector('#sponsor-ninja-image-initials').innerHTML = newAvatar
  values.name = value

  if (values.image === 2) {
    document.querySelector('#sponsor-ninja-preview-image').innerHTML = newAvatar
  }
}

const handleWebsiteChange = e => {
  const preview = document.querySelector(`#sponsor-ninja-preview`)
  container.querySelector('#sponsor-ninja-website-input').removeAttribute('data-error')
  container.querySelector('#sponsor-ninja-website-input+span').innerHTML = ''

  if (e.target.value && isValidUrl(e.target.value)) {
    preview.href = e.target.value
    preview.target = '_blank'
    preview.rel = 'noopener noreferrer'
    preview.querySelector(`.${classes.circleTextBottom}`).innerHTML = `visit 🔗`
    values.website = e.target.value
  } else {
    preview.removeAttribute('href')
    preview.removeAttribute('target')
    preview.removeAttribute('rel')
    preview.querySelector(`.${classes.circleTextBottom}`).innerHTML = ''
    values.website = null
  }

  updateCircleText(preview)
}

const handleValueChange = elem => {
  const newValue = parseInt(elem.dataset.value)
  values.amount = newValue
  setupStripeForm(newValue)

  const valueButtons = document.querySelectorAll(`#sponsor-ninja-amount-buttons button`)
  Array.from(valueButtons).map((e) => {
    if (e.dataset.value === elem.dataset.value) {
      e.classList.add(classes.activeButton)
    } else {
      e.classList.remove(classes.activeButton)
    }
  })
  const preview = document.querySelector(`#sponsor-ninja-preview`)
  preview.dataset.amount = newValue
}

const handleImageChange = (e, i) => {
  values.image = i
  document.querySelector('#sponsor-ninja-preview-image').innerHTML = images[i].toString()

  const imageButtons = document.querySelectorAll(`.${classes.imageContainer} > *`)
  Array.from(imageButtons).map((elem, index) => {
    if (index === i) {
      elem.classList.add(classes.profileActive)
    } else {
      elem.classList.remove(classes.profileActive)
    }
  })
}

const handleImageUpload = async e => {
  const file = e.target.files[0]
  const src = URL.createObjectURL(file)

  if (src) {
    images[3] = `<img src="${src}" alt="uploaded file preview" class="${classes.previewUploadImage}"/>`

    handleImageChange(null, 3)

    const resizedFile = await getResizedImage({ file, imageMaxSize: 200 })
    values.file = resizedFile
  }
}

const shuffleImages = () => {
  const random = getRandomInt(10000)
  const newEmoji = createAvatar(funEmoji, { seed: random });
  const newIdenticon = createAvatar(identicon, { seed: random });

  const emojiString = newEmoji
  const identiconString = newIdenticon

  images[0] = emojiString
  images[1] = identiconString

  document.querySelector('#sponsor-ninja-image-emoji').innerHTML = emojiString.toString()
  document.querySelector('#sponsor-ninja-image-identicon').innerHTML = identiconString.toString()
  document.querySelector('#sponsor-ninja-preview-image').innerHTML = images[values.image].toString()
}

const setupStripeForm = (value = 10) => {
  fetch(`${process.env.DOMAIN}/api/donate?id=${sponsorNinjaProjectId}&value=${value}`)
    .then(res => res.json())
    .then(donateData => {
      stripe = Stripe(donateData.user_public_key);
      sponsorNinjaClientSecret = donateData.client_secret
      const stripe_elements = stripe.elements();
      sponsorNinjaCardNumber = stripe_elements.create('cardNumber')
      sponsorNinjaCardExpiry = stripe_elements.create('cardExpiry')
      sponsorNinjaCardCvc = stripe_elements.create('cardCvc')

      sponsorNinjaCardNumber.mount('#sponsor-ninja-card-number');
      sponsorNinjaCardExpiry.mount('#sponsor-ninja-card-expiry')
      sponsorNinjaCardCvc.mount('#sponsor-ninja-card-cvc')
    })
}

const addButton = ({ name, position }) => `<a id="sponsor-ninja-new-donation" class="${classes.donationCircle} ${classes.newDonation}">
  +
  <span class="${classes.circleTextTop}">Become a</span>
  <span class="${classes.circleTextBottom}">Sponsor</span>
</a>
<div class="${classes.createModal} ${position === 'top' ? classes.topModal : ''}">
  <button class="${classes.modalCloseButton}">X</button>
  <h3>Your donation for<br/>${name}</h3>

  <div id="sponsor-ninja-tab-1">
    <div id="sponsor-ninja-amount-buttons" class="${classes.buttonGroup}">
      <button data-value="5">
        5$
      </button><button class="${classes.activeButton}" data-value="10">
        10$</button>
      <button data-value="25">25$</button><button data-value="50">
        50$
      </button>
    </div>

    <h3>Your depiction</h3>

    <label>Display Name</label>
    <input id="sponsor-ninja-name-input" type="text" maxlength="20" placeholder="Anonymous" />

    <label>Website</label>
    <input id="sponsor-ninja-website-input" type="text" placeholder="https://example.com" /><span></span>

    <label>Image</label>
    <div class="${classes.imageContainer}">
      <div id="sponsor-ninja-image-emoji" class="${classes.profileImage} ${classes.profileActive}">${images[0].toString()}</div>
      <div id="sponsor-ninja-image-identicon" class="${classes.profileImage}">${images[1].toString()}</div>
      <div id="sponsor-ninja-image-initials" class="${classes.profileImage}">${images[2].toString()}</div>
      <label for="sponsor-ninja-file-upload" id="sponsor-ninja-upload-image" class="${classes.profileImage} ${classes.uploadImage}">${uploadIcon}</label>
      <input id="sponsor-ninja-file-upload" accept="image/*" type="file" class="${classes.fileInput}"/>
    </div>
    <span id="sponsor-ninja-shuffle-images" class="${classes.infoLink}">Shuffle Images</span>
  </div>

  <div id="sponsor-ninja-tab-2" class="${classes.hidden}">
    <label>Card Number</label>
    <div id="sponsor-ninja-card-number" class="${classes.stripeInputContainer}"></div>

    <label>Card Expiry</label>
    <div id="sponsor-ninja-card-expiry" class="${classes.stripeInputContainer}"></div>

    <label>Card CVC</label>
    <div id="sponsor-ninja-card-cvc" class="${classes.stripeInputContainer}"></div>
  </div>

  <div id="sponsor-ninja-tab-3" class="${classes.hidden}">
    <h3>Thank you for your donation</h3>
    <span class="${classes.successEmoji}">💖</span>
  </div>

  <span class="${classes.info} ${classes.error}" id="sponsor-ninja-error-message"></span>

  <button class="${classes.createButton}">Continue</button>

  <div class="${classes.info}">
    Powered by <a href="https://sponsor.ninja" target="_blank" rel="noopener noreferrer">sponsor.ninja</a> & <a href="https://stripe.com/" targer="_blank" rel="noopener noreferrer">Stripe</a>
  </div>
</div>`

const openModal = e => {
  e.preventDefault()

  if (!e.target.classList.contains(classes.active)) {
    e.target.classList.add(classes.active)
    container.querySelector(`.${classes.createModal}`).classList.add(classes.visible)

    if (widgetState !== 3) {
      const preview = previewCircle(values)
      container.prepend(preview)
      updateCircleText(container)
      setupStripeForm(10)
    }
  }
}

const closeModal = () => {
  container.querySelector('#sponsor-ninja-new-donation').classList.remove(classes.active)
  container.querySelector(`.${classes.createModal}`).classList.remove(classes.visible)

  if (widgetState === 3) {
    container.querySelector('#sponsor-ninja-preview').classList.remove(classes.active)
  } else {
    container.querySelector('#sponsor-ninja-preview').remove()
  }
}

const createPendingDonation = async projectId => {
  const { paymentIntent } = await stripe.retrievePaymentIntent(sponsorNinjaClientSecret)

  await fetch(`${process.env.DOMAIN}/api/donate?id=${projectId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      payment_id: paymentIntent.id,
      data: {
        name: values.name,
        website: values.website,
        avatar: values.image <= 2 && images[values.image].toString(),
        image: values.image === 3 && values.file
      },
    })
  }).then(res => res.json())
}

const renderWidget = async ({ id, targetElem, position }) => {
  jss.setup(preset())
  const attachedStyles = jss.createStyleSheet(styles).attach()
  classes = attachedStyles.classes

  let stripeJs = document.createElement("script");
  stripeJs.type = "text/javascript";
  stripeJs.src = 'https://js.stripe.com/v3/';
  document.body.appendChild(stripeJs);

  container = document.createElement('div')
  container.classList.add(classes.container)

  // render placeholder
  for (let i = 0; i < 3; i++) {
    const placeholder = document.createElement('div')
    placeholder.classList.add(classes.placeholder)
    container.appendChild(placeholder)
  }

  targetElem.appendChild(container)

  const data = await fetch(`${process.env.DOMAIN}/api/project?id=${id}`).then(res => res.json())

  // -- render add button & modal -- //
  container.innerHTML = addButton({ name: data.name, position })

  for (const donation of data.donations) {
    const preview = getDonationCircle({
      name: donation.name,
      website: donation.website,
      image: donation.avatar || `<img src="${donation.image}" class="${classes.previewUploadImage}" alt="avatar of ${donation.name}"/>`,
      amount: (donation.amount / 100).toString()
    })
    container.prepend(preview)
  }

  const donationCircles = container.querySelectorAll(`.${classes.donationCircle}`)
  Array.from(donationCircles).map((el, i) => {
    updateCircleText(el)
  })

  // open modal
  container.querySelector('#sponsor-ninja-new-donation').addEventListener('click', openModal)

  // close modal
  container.querySelector(`.${classes.modalCloseButton}`).addEventListener('click', closeModal)

  // update content
  container.querySelector('#sponsor-ninja-name-input').addEventListener('input', handleNameChange, false)
  container.querySelector('#sponsor-ninja-website-input').addEventListener('input', handleWebsiteChange, false)
  container.querySelector('#sponsor-ninja-shuffle-images').addEventListener('click', shuffleImages)
  container.querySelector('#sponsor-ninja-file-upload').addEventListener('change', handleImageUpload)

  const imageButtons = container.querySelectorAll(`.${classes.imageContainer} > div`)
  Array.from(imageButtons).map((el, i) => {
    el.addEventListener('click', e => handleImageChange(e, i))
  })

  const amountButtons = container.querySelectorAll('#sponsor-ninja-amount-buttons button')
  Array.from(amountButtons).map(el => {
    el.addEventListener('click', () => handleValueChange(el))
  })

  container.querySelector(`.${classes.createButton}`).addEventListener('click', async () => {
    if (widgetState === 1) {
      if (container.querySelector('#sponsor-ninja-website-input').value && !values.website) {
        const error = 'Invalid website. Please enter a valid website (including "https://") or remove the address.'
        container.querySelector('#sponsor-ninja-website-input').dataset.error = error
        container.querySelector('#sponsor-ninja-website-input+span').innerHTML = error
      } else {
        createPendingDonation(id)
        container.querySelector('#sponsor-ninja-tab-1').classList.add(classes.hidden)
        container.querySelector('#sponsor-ninja-tab-2').classList.remove(classes.hidden)
        container.querySelector(`.${classes.createButton}`).innerHTML = 'Complete Payment'
        widgetState = 2
      }
    } else if (widgetState === 2 && !loading){
      const errorContainer = document.querySelector('#sponsor-ninja-error-message')
      loading = true
      errorContainer.innerHTML = ''
      container.querySelector(`.${classes.createButton}`).classList.add(classes.loadingButton)
      const result = await stripe.confirmCardPayment(sponsorNinjaClientSecret, {
        payment_method: {
          card: sponsorNinjaCardNumber
        }
      })

      if (result.error) {
        errorContainer.innerHTML = result.error.message
      } else {
        const previewCircle = document.querySelector('#sponsor-ninja-preview')
        party.confetti(previewCircle)
        widgetState = 3
        container.querySelector('#sponsor-ninja-tab-2').classList.add(classes.hidden)
        container.querySelector('#sponsor-ninja-tab-3').classList.remove(classes.hidden)
        container.querySelector(`.${classes.createButton}`).innerHTML = 'Close Modal'
      }

      container.querySelector(`.${classes.createButton}`).classList.remove(classes.loadingButton)
      loading = false
    } else if (widgetState === 3) {
      closeModal()
    }
  })
}


export default {
  init: ({
    id,
    target,
    position = 'bottom',
  }) => {
    if (!id || !target) {
      console.warn('missing data attributes for sponsor-ninja-widget')
    } else {
      const targetElem = document.querySelector(target)
      sponsorNinjaProjectId = id

      if (!targetElem) {
        console.warn('could not find target DOM element for sponsor-ninja-widget')
      } else {
        targetElem.innerHTML = '' // clear existing content
        renderWidget({ id, targetElem, position })
      }
    }
  }
}