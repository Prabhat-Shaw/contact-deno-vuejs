import Contact from '../models/Contact.ts'

// @desc    Get contacts
// @route   GET /api/v1/contacts
// @access  Public
const getContacts = async (req: any) => {
  const contacts = await Contact.find()
  await req.respond({
    status: 200,
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({ success: true, data: contacts })
  })
}

// @desc    Get contacts
// @route   GET /api/v1/contacts/:id
// @access  Public
const getContact = async (req: any) => {
  const [_, id] = req.match

  const contact = await Contact.findOne({ _id: { $oid: id } })

  if (!contact) {
    return await req.respond({
      status: 400,
      headers: new Headers({
        'content-type': 'application/json'
      }),
      body: JSON.stringify({
        success: false,
        data: `No contact with id of ${id}`
      })
    })
  }

  await req.respond({
    status: 200,
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({ success: true, data: contact })
  })
}

// @desc    Update contacts
// @route   PUT /api/v1/contacts/:id
// @access  Public
const updateContact = async (req: any) => {
  const [_, id] = req.match
  let { firstName, lastName, phoneNumber } = (await req.json()) as {
    firstName: string
    lastName: string
    phoneNumber: number
  }

  const updateId = { $oid: id }

  await Contact.updateOne(
    { _id: updateId },
    {
      $set: { firstName, lastName, phoneNumber, updatedAt: new Date() }
    }
  )

  const contact = await Contact.findOne({ _id: updateId })

  await req.respond({
    status: 200,
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({ success: true, data: contact })
  })
}

// @desc    Create contacts
// @route   POST /api/v1/contacts
// @access  Public
const createContact = async (req: any) => {
  const data = (await req.json()) as {
    firstName: string
    lastName: string
    phoneNumber: number
  }

  let contact = await Contact.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  contact = await Contact.findOne({ _id: contact })

  await req.respond({
    status: 200,
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({ success: true, data: contact })
  })
}

// @desc    Delete contacts
// @route   DELETE /api/v1/contacts/:id
// @access  Public
const deleteContact = async (req: any) => {
  const [_, id] = req.match

  let contact = await Contact.findOne({ _id: { $oid: id } })

  if (!contact) {
    return await req.respond({
      status: 404,
      headers: new Headers({
        'content-type': 'application/json'
      }),
      body: JSON.stringify({
        success: false,
        data: `No contact with id of ${id}`
      })
    })
  }

  await Contact.deleteOne({ _id: { $oid: id } })

  await req.respond({
    status: 200,
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({ success: true, data: contact })
  })
}

export { getContacts, getContact, createContact, updateContact, deleteContact }
