// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixData from 'wix-data'

$w.onReady(function () {})
$w('#dataset1').onReady(() => {
  const dynamicPageId = $w('#dynamicDataset').getCurrentItem()._id

  $w('#dataset1').setFilter(wixData.filter().hasSome('tags', [dynamicPageId]))
})
