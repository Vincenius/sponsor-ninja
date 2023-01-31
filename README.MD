# Sponsor Ninja

An easy & free way to collect sponsorships for your projects.

You can self-host the project or use the web app on [sponsor.ninja](https://sponsor.ninja). No worries it's free (donation based)!

After creating a project on the website you can embed a script to generate the widget.


__via script__
```
<script src="https://app.sponsor.ninja/widget.js"></script>
<script>
  new SponsorNinja({
    id: 'your-project-id',
    target: '#widget-container',
  })
</script>
```

__via npm__
```
// npm i sponsor-ninja-widget --save
import { SponsorNinja } from 'sponsor-ninja-widget'

new SponsorNinja({
  id: 'your-project-id',
  target: '#widget-container'
})
```


You can pass following optional options:

- *__color__ (default = "#0ac3c5")* : the primary color of the widget
- *__alignment__ (default = "center")* : the alignment of the circles
- *__position__ (default = "bottom")* : the position of the modal

## app

This is a Next.js application that handles the login and the creation of projects


## widget

This is a webpack project that creates the widget.js and the npm package, which needs to be included on the page


### next todos

- write proper readme
- edit and delete projects
- static html export of circles for email newsletter embed
- more widget options
  - dark mode
  - limit donations display
- minify and improve file size
- email input for payment receipts
- more payment methods
- cron job to cleanup old pending donations
- add tests


## License
[MIT](https://choosealicense.com/licenses/mit/)


---


*created by [Vincent Will](https://twitter.com/wweb_dev)*