const genericMetatada = {
  name: 'Awesome NFT Laser Cat #',
  description: 'Something beautiful you will never see again #',
  attributes: [],
  image: ''
};

const genericImageUrl = `https://picsum.photos/id/[id]/200/300`;

export function generateMetadata(id: number) {
  const metatada = { ...genericMetatada };
  metatada.name = genericMetatada.name + id;
  metatada.description = genericMetatada.description + id;
  metatada.image = genericImageUrl.replace('[id]', id.toString());

  return metatada;
}
