// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

import wixData from 'wix-data'

$w.onReady(async function () {
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
        const tags = res.items
        const options = tags.map((tag) => {
          return { label: tag.label, value: tag._id }
        })
        $w('#dropdowntags').onChange((e) => {
          filterPosts(e.target.value)
        })
        $w('#dropdowntags').options = options
      }
    })

  const divisas = await getDivisas()
  const acciones = await getAcciones()
  const etf = await getETFs()
  const commodities = await getCommodities()
  const indices = await getIndices()

  const usdclp = divisas.find((divisa) => divisa.nemo === 'USDCLP')
  $w('#value').text = usdclp.buy.toString()

  const option = $w('#selectTable')
  const table = $w('#summarytable')

  option.onChange((event) => {
    updateTable(
      event.target.value,
      { divisas, acciones, etf, commodities, indices },
      table
    )
  })

  updateTable(
    option.value,
    { divisas, acciones, etf, commodities, indices },
    table
  )
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

function updateTable(value, data, table) {
  switch (value) {
    case 'divisas':
      table.rows = data.divisas
      break
    case 'acciones':
      table.rows = data.acciones
      break
    case 'etf':
      table.rows = data.etf
      break
    case 'commodities':
      table.rows = data.commodities
      break
    case 'indices':
      table.rows = data.indices
      break
    default:
      table.rows = data.divisas
      break
  }
  table.refresh()
}

async function getDivisas() {
  const res = await fetch(
    'https://nfj1wzmd59.execute-api.us-east-2.amazonaws.com/master/prices/currencies'
  )
  const data = await res.json()

  const divisas = Object.keys(data).map((key) => {
    return {
      nemo: key,
      name: data[key].name.slice(0, 3) + '-' + data[key].name.slice(3),
      buy: data[key].buy,
      sell: data[key].sell,
    }
  })

  return divisas
}
async function getAcciones() {
  const res = await fetch(
    'https://nfj1wzmd59.execute-api.us-east-2.amazonaws.com/master/prices/stocks'
  )
  const data = await res.json()

  const acciones = Object.keys(data).map((key) => {
    return {
      nemo: key,
      name: data[key].name,
      buy: data[key].buy,
      sell: data[key].sell,
    }
  })

  return acciones
}
async function getETFs() {
  const res = await fetch(
    'https://nfj1wzmd59.execute-api.us-east-2.amazonaws.com/master/prices/etfs'
  )
  const data = await res.json()

  const etf = Object.keys(data).map((key) => {
    return {
      nemo: key,
      name: data[key].name,
      buy: data[key].buy,
      sell: data[key].sell,
    }
  })

  return etf
}
async function getCommodities() {
  const res = await fetch(
    'https://nfj1wzmd59.execute-api.us-east-2.amazonaws.com/master/prices/commodities'
  )
  const data = await res.json()

  const commodities = Object.keys(data).map((key) => {
    return {
      nemo: key,
      name: data[key].name,
      buy: data[key].buy,
      sell: data[key].sell,
    }
  })

  return commodities
}
async function getIndices() {
  const res = await fetch(
    'https://nfj1wzmd59.execute-api.us-east-2.amazonaws.com/master/prices/stock-index'
  )
  const data = await res.json()

  const indices = Object.keys(data).map((key) => {
    return {
      nemo: key,
      name: data[key].name,
      buy: data[key].buy,
      sell: data[key].sell,
    }
  })

  return indices
}
