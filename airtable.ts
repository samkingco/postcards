const Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base("app9BmpB6mW0j0QKt");

interface Image {
  width: number;
  height: number;
  url: string;
}

export interface Postcard {
  id: string;
  images: Image[];
  tags: string[];
  sent: boolean;
  dateSent: number;
}

function transformRecord(record: any): Postcard {
  const imageRecord = record.get("Image");
  const images =
    imageRecord &&
    imageRecord.map((i: any) => ({
      width: i.thumbnails && i.thumbnails.large ? i.thumbnails.large.width : 0,
      height:
        i.thumbnails && i.thumbnails.large ? i.thumbnails.large.height : 0,
      url: i.url,
    }));
  const tags = record.get("Tags");
  const sent = record.get("Sent");
  const dateSent = record.get("Date sent");

  const transformedRecord: Postcard = {
    id: record.id,
    images,
    tags,
    sent: Boolean(sent),
    dateSent: dateSent ? new Date(dateSent).getTime() : 0,
  };

  return transformedRecord;
}

export async function getInventory() {
  const postcards: Postcard[] = [];

  await base("Postcards")
    .select({ view: "Inventory" })
    .eachPage((records: any, fetchNextPage: any) => {
      records.forEach((record: any) => {
        const inventoryItem = transformRecord(record);

        // Object.keys(inventoryItem).forEach((key) =>
        //   inventoryItem[key] === undefined ? delete inventoryItem[key] : {}
        // );

        if (inventoryItem.images && inventoryItem.images.length > 0) {
          postcards.push(inventoryItem);
        }
      });
      fetchNextPage();
    });

  return postcards;
}
