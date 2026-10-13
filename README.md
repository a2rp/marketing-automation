![Goodbrief campaign workspace](screenshots/overview.png)

# Goodbrief

A campaign workspace for shaping useful customer messages and lifecycle journeys. The interface brings journey planning, campaign drafts, and audience segments into one focused frontend demo.

**Live demo:** https://a2rp.github.io/marketing-automation/

## Workspace pages

- **Journeys** - search and filter paths, duplicate them, pause or activate them, and remove them with a confirmation dialog.
- **Journey builder** - add email, wait, and condition steps; edit their details; change their order; enable or pause steps; and review the entry trigger. Activation requires an enabled email step.
- **Campaigns** - draft messages, edit subject and body copy, preview the message, duplicate drafts, schedule a local sample status, and review example open/click results.
- **Audiences** - build contact segments from sample rules, preview matching records, search within a segment, and download the visible records as CSV.
- **Not found** - return to a workspace route from an unknown address.

All journey, campaign, and segment changes use React state and reset on refresh. Contacts and performance figures are fictional. Scheduling only changes a visible sample status; it does not send email. The app does not use Local Storage or a backend.

## Screenshots

### Pages

| Workspace | Preview |
| --- | --- |
| Journey library | ![Journey library](screenshots/pages/journeys.png) |
| Journey builder | ![Journey builder](screenshots/pages/journey-builder.png) |
| Campaign studio | ![Campaign studio](screenshots/pages/campaigns.png) |
| Audience segments | ![Audience segments](screenshots/pages/audiences.png) |
| Audience segments on mobile | ![Mobile audience view](screenshots/pages/audiences-mobile.png) |
| Not found | ![Not found page](screenshots/pages/not-found.png) |

### Dialogs

| Action | Preview |
| --- | --- |
| Create a journey | ![Create journey dialog](screenshots/modals/create-journey.png) |
| Delete a journey | ![Delete journey confirmation](screenshots/modals/delete-journey.png) |
| Remove a journey step | ![Remove journey step confirmation](screenshots/modals/remove-journey-step.png) |
| Create a campaign | ![Create campaign dialog](screenshots/modals/create-campaign.png) |
| Preview a campaign | ![Campaign preview dialog](screenshots/modals/campaign-preview.png) |
| Edit campaign content | ![Campaign editor dialog](screenshots/modals/edit-campaign.png) |
| Delete a campaign | ![Delete campaign confirmation](screenshots/modals/delete-campaign.png) |
| Build an audience segment | ![Create segment dialog](screenshots/modals/create-segment.png) |
| Delete an audience segment | ![Delete segment confirmation](screenshots/modals/delete-segment.png) |

## Run locally

```bash
npm install
npm run dev
```

## Check and deploy

```bash
npm run lint
npm run build
npm run deploy
```

The deploy script builds the app, copies `index.html` to the GitHub Pages `404.html` fallback, and publishes `dist` to the `gh-pages` branch.

## Future improvements

A backend can persist journeys and audiences, connect customer events and email delivery, support team access, and provide live campaign analytics.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://www.buymeacoffee.com/a2rp](https://www.buymeacoffee.com/a2rp)
