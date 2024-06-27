// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

import wixData from 'wix-data'

$w.onReady(function () {
  // Write your JavaScript here
  // To select an element by ID use: $w("#elementID")
  // Click "Preview" to run your code

  wixData
    .query('Blog/Posts')
    .find()
    .then((results) => {
      if (results.items.length > 0) {
        const contentNew = $w('#principal')
        const post = results.items[0]
        const tags = post.tags
        $w('#datasetlast').setFilter(wixData.filter().ne('_id', post._id))
        wixData
          .query('Blog/Tags')
          .hasSome('_id', tags)
          .find()
          .then((tagsResult) => {
            const tagData = tagsResult.items
            const options = tagData.map((tag) => {
              return { label: tag.label, value: tag.slug }
            })

            $w('#newtags').options = options
            $w('#newtags').show()
            $w('#newtags').disable()
            $w('#newtags').onChange((e) => {
              e.preventDefault()
              e.stopPropagation()
            })

            contentNew.show()
          })
      }
    })
    .catch((e) => {
      console.error(e)
    })

  // Repetidor de last post
  wixData
    .query('Blog/Tags')
    .gt('postCount', 6)
    .find()
    .then((res) => {
      if (res.items.length > 0) {
        const tags = res.items //[ { _id: '1', label: 'tag1' }, { _id: '2', label: 'tag2' }]
        const options = tags.map((tag) => {
          return { label: tag.label, value: tag._id }
        })
        $w('#dropdowntags').onChange((e) => {
          filterPosts(e.target.value)
        })
        $w('#dropdowntags').options = options
      }
    })
})

$w('#datasetlast').onReady(() => {
  $w('#datasetlast')
    .getItems(1, 4)
    .then((res) => {
      let items = res.items
      wixData
        .query('Blog/Tags')
        .limit(4)
        .find()
        .then((tagsResult) => {
          const tags = tagsResult.items
          const options = tags.map((tag) => {
            return [{ label: tag.label, value: tag.slug }]
          })
          $w('#repeaterpost').forEachItem(($item, itemData, index) => {
            $item('#postags').options = options[index]
            $item('#postags').show()
            $item('#postags').disable()

            $item('#postags').onChange((e) => {
              e.preventDefault()
              e.stopPropagation()
            })
          })
        })
        .catch((e) => {
          console.error(e)
        })
    })
})

function filterPosts(tagId) {
  if (tagId.length < 1) {
    $w('#datasetend').setFilter(wixData.filter())

    return
  }

  $w('#datasetend').setFilter(wixData.filter().hasSome('tags', tagId))
  return
}
