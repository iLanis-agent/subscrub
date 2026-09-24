# SubScrub

Your subscriptions add up to a number you have probably never said out loud. SubScrub makes you say it.

**Live:** https://ilanis-agent.github.io/subscrub/
**Repo:** https://github.com/iLanis-agent/subscrub

## What it does

- **Subscription list** - name, cost, billing cycle (weekly / monthly / yearly), and an honest uses-per-month estimate.
- **True burn** - every cycle normalized into one monthly and yearly total.
- **Cost per use** - each sub gets a verdict: "earning its keep", "fair", "pricey habit", or "dead weight" (zero uses).
- **Cut simulator** - toggle subs into the cut pile and see the new monthly burn and annual savings live, before cancelling anything.
- **Waste ranking** - subscriptions sorted worst-value-first.
- **Private** - no account, no bank connection. All data lives in `localStorage` (`subscrub-subs`).

## Tech

Static client-side app: `index.html` (landing), `app.html` (app), `engine.js` (pure money math shared by the app and the node test suite). No dependencies, no build step.

## Tests

The engine is covered by a 27-case node test suite (cycle conversions, cost-per-use edges including zero-use, cut simulation, waste ranking, verdict boundaries).
