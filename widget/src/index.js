import jss from 'jss'
import preset from 'jss-preset-default'

import CircleType from 'circletype'
import { createAvatar } from '@dicebear/core'
import { funEmoji, identicon, initials } from '@dicebear/collection'
import party from 'party-js'

import getStyles from './styles.js'
import { isValidUrl, getRandomInt, getResizedImage } from './utils.js'
import { uploadIcon } from './svgs.js'

let classes
const random = getRandomInt(10000)

class SponsorNinja {
  constructor({
    id,
    target,
    position = 'bottom',
    stage = 'prod',
    color = '#0ac3c5',
    alignment = 'center',
  }) {
    this.color = color
    this.alignment = alignment
    this.widgetState = 1;
    this.images = [
      createAvatar(funEmoji, { seed: random }),
      createAvatar(identicon, { seed: random }),
      createAvatar(initials, { seed: 'Anonymous' }),
    ]
    this.values = {
      amount: 10,
      name: 'Anonymous',
      website: null,
      image: 0,
      file: '',
    }

    if (!id || !target) {
      console.warn('missing data attributes for sponsor-ninja-widget')
    } else {
      const targetElem = document.querySelector(target)
      this.projectId = id

      if (!targetElem) {
        console.warn('could not find target DOM element for sponsor-ninja-widget')
      } else {
        const alreadyRendered = targetElem.dataset.sponsorNinjaExists
        if (!alreadyRendered) { // prevent duplicate render
          targetElem.dataset.sponsorNinjaExists = true
          this.domContainer = targetElem
          this.DOMAIN = stage === 'dev' ? process.env.DEV_DOMAIN : process.env.DOMAIN
          this.renderWidget({ id, targetElem, position })
        }
      }
    }
  }

  // functions
  updateCircleText = wrapper => {
    const circleTypeTop = new CircleType(wrapper.querySelector(`.${classes.circleTextTop}`))
    circleTypeTop.radius(50)
    const circleTypeBottom = new CircleType(wrapper.querySelector(`.${classes.circleTextBottom}`))
    circleTypeBottom.radius(50).dir(-1)
  }
  previewCircle = ({ name, image = 0, website }) => {
    const imageValue = image !== 3
      ? this.images[image].toString()
      : this.images[image]

    const preview = this.getDonationCircle({ name, image: imageValue, website })
    preview.classList.add('sponsor-ninja-preview')
    preview.classList.add(classes.active)

    return preview
  }
  getDonationCircle = ({ name, website, image, amount = '10' }) => {
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
      <span class="sponsor-ninja-preview-image ${classes.circleImage}">${image}</span>
      <span class="${classes.circleTextTop}">${name}</span>
      <span class="${classes.circleTextBottom}">${bottomText}</span>`

    return preview
  }
  handleNameChange = e => {
    const value = e.target.value || 'Anonymous'
    const preview = this.domContainer.querySelector(`.sponsor-ninja-preview`)
    const previewName = preview.querySelector(`.${classes.circleTextTop}`)

    previewName.innerHTML = value
    this.updateCircleText(preview)

    const newInitials = createAvatar(initials, { seed: value })
    const newAvatar = newInitials
    this.images[2] = newInitials

    this.domContainer.querySelector('.sponsor-ninja-image-initials').innerHTML = newAvatar
    this.values.name = value

    if (this.values.image === 2) {
      this.domContainer.querySelector('.sponsor-ninja-preview-image').innerHTML = newAvatar
    }
  }
  handleWebsiteChange = e => {
    const preview = this.domContainer.querySelector(`.sponsor-ninja-preview`)
    this.domContainer.querySelector('.sponsor-ninja-website-input').removeAttribute('data-error')
    this.domContainer.querySelector('.sponsor-ninja-website-input+span').innerHTML = ''

    if (e.target.value && isValidUrl(e.target.value)) {
      preview.href = e.target.value
      preview.target = '_blank'
      preview.rel = 'noopener noreferrer'
      preview.querySelector(`.${classes.circleTextBottom}`).innerHTML = `visit 🔗`
      this.values.website = e.target.value
    } else {
      preview.removeAttribute('href')
      preview.removeAttribute('target')
      preview.removeAttribute('rel')
      preview.querySelector(`.${classes.circleTextBottom}`).innerHTML = ''
      this.values.website = null
    }

    this.updateCircleText(preview)
  }
  handleValueChange = elem => {
    const newValue = parseInt(elem.dataset.value)
    this.values.amount = newValue
    this.setupStripeForm(newValue)

    const valueButtons = this.domContainer.querySelectorAll(`.sponsor-ninja-amount-buttons button`)
    Array.from(valueButtons).map((e) => {
      if (e.dataset.value === elem.dataset.value) {
        e.classList.add(classes.activeButton)
      } else {
        e.classList.remove(classes.activeButton)
      }
    })
    const preview = this.domContainer.querySelector(`.sponsor-ninja-preview`)
    preview.dataset.amount = newValue
  }
  handleImageChange = (e, i) => {
    this.values.image = i
    this.domContainer.querySelector('.sponsor-ninja-preview-image').innerHTML = this.images[i].toString()

    const imageButtons = this.domContainer.querySelectorAll(`.${classes.imageContainer} > *`)
    Array.from(imageButtons).map((elem, index) => {
      if (index === i) {
        elem.classList.add(classes.profileActive)
      } else {
        elem.classList.remove(classes.profileActive)
      }
    })
  }
  handleImageUpload = async e => {
    const file = e.target.files[0]
    const src = URL.createObjectURL(file)

    if (src) {
      this.images[3] = `<img src="${src}" alt="uploaded file preview" class="${classes.previewUploadImage}"/>`

      this.handleImageChange(null, 3)

      const resizedFile = await getResizedImage({ file, imageMaxSize: 200 })
      this.values.file = resizedFile
    }
  }
  shuffleImages = () => {
    const random = getRandomInt(10000)
    const newEmoji = createAvatar(funEmoji, { seed: random });
    const newIdenticon = createAvatar(identicon, { seed: random });

    const emojiString = newEmoji
    const identiconString = newIdenticon

    this.images[0] = emojiString
    this.images[1] = identiconString

    this.domContainer.querySelector('.sponsor-ninja-image-emoji').innerHTML = emojiString.toString()
    this.domContainer.querySelector('.sponsor-ninja-image-identicon').innerHTML = identiconString.toString()
    this.domContainer.querySelector('.sponsor-ninja-preview-image').innerHTML = this.images[this.values.image].toString()
  }
  setupStripeForm = (value = 10) => {
    fetch(`${this.DOMAIN}/api/donate?id=${this.projectId}&value=${value}`)
      .then(res => res.json())
      .then(donateData => {
        this.stripe = Stripe(donateData.user_public_key);
        this.clientSecret = donateData.client_secret
        const stripe_elements = this.stripe.elements();
        this.sponsorNinjaCardNumber = stripe_elements.create('cardNumber')
        this.sponsorNinjaCardExpiry = stripe_elements.create('cardExpiry')
        this.sponsorNinjaCardCvc = stripe_elements.create('cardCvc')

        this.sponsorNinjaCardNumber.mount('.sponsor-ninja-card-number');
        this.sponsorNinjaCardExpiry.mount('.sponsor-ninja-card-expiry')
        this.sponsorNinjaCardCvc.mount('.sponsor-ninja-card-cvc')
      })
  }
  addButton = ({ name, position }) => `<a class="sponsor-ninja-new-donation ${classes.donationCircle} ${classes.newDonation}">
    +
    <span class="${classes.circleTextTop}">Become a</span>
    <span class="${classes.circleTextBottom}">Sponsor</span>
  </a>
  <div class="${classes.createModal} ${position === 'top' ? classes.topModal : ''}">
    <button class="${classes.modalCloseButton}">X</button>
    <h3>Your donation for<br/><span class="${classes.highlightText}">${name}</span></h3>

    <div class="sponsor-ninja-tab-1">
      <div class="sponsor-ninja-amount-buttons ${classes.buttonGroup}">
        <button data-value="5">
          5$
        </button><button class="${classes.activeButton}" data-value="10">
          10$</button>
        <button data-value="25">25$</button><button data-value="50">
          50$
        </button>
      </div>

      <label>Display Name (optional)</label>
      <input class="sponsor-ninja-name-input" type="text" maxlength="20" placeholder="Anonymous" />

      <label>Website (optional)</label>
      <input class="sponsor-ninja-website-input" type="text" placeholder="https://example.com" /><span></span>

      <label>Image</label>
      <div class="${classes.imageContainer}">
        <div class="sponsor-ninja-image-emoji ${classes.profileImage} ${classes.profileActive}">${this.images[0].toString()}</div>
        <div class="sponsor-ninja-image-identicon ${classes.profileImage}">${this.images[1].toString()}</div>
        <div class="sponsor-ninja-image-initials ${classes.profileImage}">${this.images[2].toString()}</div>
        <label for="sponsor-ninja-file-upload-${this.projectId}" class="${classes.profileImage} ${classes.uploadImage}">${uploadIcon}</label>
        <input id="sponsor-ninja-file-upload-${this.projectId}" accept="image/*" type="file" class="sponsor-ninja-file-upload ${classes.fileInput}"/>
      </div>
      <span class="sponsor-ninja-shuffle-images ${classes.infoLink}">Shuffle Images</span>
    </div>

    <div class="sponsor-ninja-tab-2 ${classes.hidden}">
      <label>Card Number</label>
      <div class="sponsor-ninja-card-number ${classes.stripeInputContainer}"></div>

      <label>Card Expiry</label>
      <div class="sponsor-ninja-card-expiry ${classes.stripeInputContainer}"></div>

      <label>Card CVC</label>
      <div class="sponsor-ninja-card-cvc ${classes.stripeInputContainer}"></div>
    </div>

    <div class="sponsor-ninja-tab-3 ${classes.hidden}">
      <h3>Thank you for your donation</h3>
      <span class="${classes.successEmoji}">💖</span>
    </div>

    <span class="sponsor-ninja-error-message ${classes.info} ${classes.error}"></span>

    <button class="${classes.createButton}">Continue</button>

    <div class="${classes.info}">
      Powered by <a href="https://sponsor.ninja" target="_blank" rel="noopener noreferrer">sponsor.ninja</a> & <a href="https://stripe.com/" targer="_blank" rel="noopener noreferrer">Stripe</a>
    </div>
  </div>`
  openModal = e => {
    e.preventDefault()

    if (!e.target.classList.contains(classes.active)) {
      e.target.classList.add(classes.active)
      this.domContainer.querySelector(`.${classes.createModal}`).classList.add(classes.visible)

      if (this.widgetState !== 3) {
        const preview = this.previewCircle(this.values)
        this.domContainer.prepend(preview)
        this.updateCircleText(this.domContainer)
        this.setupStripeForm(10)
      }
    }
  }
  closeModal = () => {
    this.domContainer.querySelector('.sponsor-ninja-new-donation').classList.remove(classes.active)
    this.domContainer.querySelector(`.${classes.createModal}`).classList.remove(classes.visible)

    if (this.widgetState === 3) {
      this.domContainer.querySelector('.sponsor-ninja-preview').classList.remove(classes.active)
    } else {
      this.domContainer.querySelector('.sponsor-ninja-preview').remove()
    }
  }
  createPendingDonation = async projectId => {
    const { paymentIntent } = await this.stripe.retrievePaymentIntent(this.clientSecret)

    await fetch(`${this.DOMAIN}/api/donate?id=${projectId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        payment_id: paymentIntent.id,
        data: {
          name: this.values.name,
          website: this.values.website,
          avatar: this.values.image <= 2 && this.images[this.values.image].toString(),
          image: this.values.image === 3 && this.values.file
        },
      })
    }).then(res => res.json())
  }
  renderWidget = async ({ id, targetElem, position }) => {
    jss.setup(preset())
    const styles = getStyles({
      variables: { highlight: this.color },
      alignment: this.alignment,
    })
    const attachedStyles = jss.createStyleSheet(styles).attach()
    classes = attachedStyles.classes

    if (!document.querySelectorAll('[src="https://js.stripe.com/v3/"]').length) {
      let stripeJs = document.createElement("script");
      stripeJs.type = "text/javascript";
      stripeJs.src = 'https://js.stripe.com/v3/';
      document.body.appendChild(stripeJs);
    }

    targetElem.classList.add(classes.container)

    // render placeholder
    for (let i = 0; i < 3; i++) {
      const placeholder = document.createElement('div')
      placeholder.classList.add(classes.placeholder)
      targetElem.appendChild(placeholder)
    }

    const data = await fetch(`${this.DOMAIN}/api/project?id=${id}`).then(res => res.json())

    // -- render add button & modal -- //
    targetElem.innerHTML = this.addButton({ name: data.name, position })

    for (const donation of data.donations) {
      const preview = this.getDonationCircle({
        name: donation.name,
        website: donation.website,
        image: donation.avatar || `<img src="${donation.image}" class="${classes.previewUploadImage}" alt="avatar of ${donation.name}"/>`,
        amount: (donation.amount / 100).toString()
      })
      targetElem.prepend(preview)
    }

    const donationCircles = this.domContainer.querySelectorAll(`.${classes.donationCircle}`)
    Array.from(donationCircles).map((el, i) => {
      this.updateCircleText(el)
    })

    // open modal
    this.domContainer.querySelector('.sponsor-ninja-new-donation').addEventListener('click', this.openModal)

    // close modal
    this.domContainer.querySelector(`.${classes.modalCloseButton}`).addEventListener('click', this.closeModal)

    // update content
    this.domContainer.querySelector('.sponsor-ninja-name-input').addEventListener('input', this.handleNameChange)
    this.domContainer.querySelector('.sponsor-ninja-website-input').addEventListener('input', this.handleWebsiteChange)
    this.domContainer.querySelector('.sponsor-ninja-shuffle-images').addEventListener('click', this.shuffleImages)
    this.domContainer.querySelector('.sponsor-ninja-file-upload').addEventListener('change', this.handleImageUpload)

    const imageButtons = this.domContainer.querySelectorAll(`.${classes.imageContainer} > div`)
    Array.from(imageButtons).map((el, i) => {
      el.addEventListener('click', e => this.handleImageChange(e, i))
    })

    const amountButtons = this.domContainer.querySelectorAll('.sponsor-ninja-amount-buttons button')
    Array.from(amountButtons).map(el => {
      el.addEventListener('click', () => this.handleValueChange(el))
    })

    this.domContainer.querySelector(`.${classes.createButton}`).addEventListener('click', async () => {
      if (this.widgetState === 1) {
        if (this.domContainer.querySelector('.sponsor-ninja-website-input').value && !this.values.website) {
          const error = 'Invalid website. Please enter a valid website (including "https://") or remove the address.'
          this.domContainer.querySelector('.sponsor-ninja-website-input').dataset.error = error
          this.domContainer.querySelector('.sponsor-ninja-website-input+span').innerHTML = error
        } else {
          this.createPendingDonation(id)
          this.domContainer.querySelector('.sponsor-ninja-tab-1').classList.add(classes.hidden)
          this.domContainer.querySelector('.sponsor-ninja-tab-2').classList.remove(classes.hidden)
          this.domContainer.querySelector(`.${classes.createButton}`).innerHTML = 'Complete Payment'
          this.widgetState = 2
        }
      } else if (this.widgetState === 2 && !this.loading){
        const errorContainer = this.domContainer.querySelector('.sponsor-ninja-error-message')
        this.loading = true
        errorContainer.innerHTML = ''
        this.domContainer.querySelector(`.${classes.createButton}`).classList.add(classes.loadingButton)
        const result = await this.stripe.confirmCardPayment(this.clientSecret, {
          payment_method: {
            card: this.sponsorNinjaCardNumber
          }
        })

        if (result.error) {
          errorContainer.innerHTML = result.error.message
        } else {
          const previewCircle = this.domContainer.querySelector('.sponsor-ninja-preview')
          party.confetti(previewCircle)
          this.widgetState = 3
          this.domContainer.querySelector('.sponsor-ninja-tab-2').classList.add(classes.hidden)
          this.domContainer.querySelector('.sponsor-ninja-tab-3').classList.remove(classes.hidden)
          this.domContainer.querySelector(`.${classes.createButton}`).innerHTML = 'Close Modal'
        }

        this.domContainer.querySelector(`.${classes.createButton}`).classList.remove(classes.loadingButton)
        this.loading = false
      } else if (this.widgetState === 3) {
        this.closeModal()
      }
    })
  }
}

export default SponsorNinja