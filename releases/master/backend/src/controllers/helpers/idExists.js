const existsById = async (Model, id) => {
  if (!id) return null
  return await Model.findById(id)
}

export default existsById