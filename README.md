# Bark

**On indefinite hiatus:** this project will be deprecated by [CSS'
prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme),
should it reach widespread adoption. Because of that, this project is now very
low priority.

A WebExtension to darken (maybe eventually brighten too) webpages.

## Features

* Works on a per element basis so if a page has dark and bright elements, both
end up dark;

* Checks whether or not the element is dark before changing it, keeping dark
pages untouched and with their beautiful originally designed styles;

* Brightens text color and darkens background colors. This works independently
from each other, which helps fix problematic sites (no more bright texts on
bright backgrounds!);

## Known Problems

* May be slow on some sites;

* Doesn't play nice with alpha colors (inverts the RGB, but keeps the alpha,
which sounds reasonable, but looks bad on some sites);

## Roadmap

* Make the CLUT a single one per browser;

* Handle background gradients;

* Publish to [AMO](https://addons.mozilla.org);
