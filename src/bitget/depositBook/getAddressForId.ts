import fs from 'fs';
import path from 'path';

const FILE_NAME = 'addressBook';
const FILE_EXT = 'csv';
const SEPARATOR = ',';
const SINGLE_ACCOUNT_CAPACITY = 50;

type RowContent = {
  address: string;
  position: number;
};

export function getAddressForId(id: number) {
  // minionId - starts with 0, bitget export starts with 1
  const positionId = id + 1;

  if (positionId > SINGLE_ACCOUNT_CAPACITY) {
    throw new Error(
      `BitGet Address book file can only contain ${SINGLE_ACCOUNT_CAPACITY} addresses`
    );
  }

  const addressBook = getBookFileContent();
  const row = addressBook.find(row => row.position === positionId);

  if (!row) {
    throw new Error(`Address not found for id ${id}`);
  }

  return row.address;
}

export function getBookFileContent(fileNumber?: number) {
  try {
    const addressBookFile = path.join(__dirname, `${FILE_NAME}${fileNumber || ''}.${FILE_EXT}`);
    const content = fs.readFileSync(addressBookFile, 'utf8');

    const rows = content.split('\n');
    const parsedRows = rows.map(row => {
      const cols = row.split(SEPARATOR);
      const [position, , address] = cols;
      const rowData: RowContent = { address, position: Number(position) };

      return rowData;
    });

    return parsedRows;
  } catch (e: any) {
    console.log('🔥', e);
    if (e.code !== 'ENOENT') {
      throw e;
    }

    return [];
  }
}
