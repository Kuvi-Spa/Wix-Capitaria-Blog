// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixData from 'wix-data'
import wixLocation from 'wix-location'

$w.onReady(function () {
  //   $w('tagstotal')

  //   $w('#selectionTags')

  wixData
    .query('Blog/Categories')
    .hasSome('_id', [
      '6658fe33fe9424942421f879',
      '6658fe002ae3c69630a39efd',
      '6658fee18122a9e6b1502598',
      '6658fdedab28958bb1ac8ae9',
    ])
    .find()
    .then((res) => {
      if (res.items.length > 0) {
        const tags = res.items
        const options = tags.map((tag) => {
          return { label: tag.label, value: tag.categoryPageUrl }
        })
        $w('#selectionTags').onChange((e) => {
          const selectedID = e.target.value
          wixLocation.to(`${selectedID}`)
        })
        $w('#selectionTags').options = options
      }
    })
    .catch((e) => {})
  // Write your JavaScript here

  // To select an element by ID use: $w('#elementID')

  // Click 'Preview' to run your code
})
