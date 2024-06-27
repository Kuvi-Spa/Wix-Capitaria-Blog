// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixData from 'wix-data'

$w.onReady(function () {
  // Write your JavaScript here
  // To select an element by ID use: $w('#elementID')
  // Click 'Preview' to run your code
})

$w('#dataset1').onReady(() => {
  const dynamicPageId = $w('#dynamicDataset').getCurrentItem()._id

  $w('#dataset1').setFilter(
    wixData.filter().hasSome('categories', [dynamicPageId])
  )
})
