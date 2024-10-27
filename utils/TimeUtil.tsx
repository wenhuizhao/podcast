export const convertISOToLocalTime = (isoString: string) => {
  if (isoString.length == 0) {
    return isoString;
  }
  // Parse the ISO string to a Date object
  const date = new Date(isoString);

  // Use toLocaleString to format according to the user's timezone
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use 24-hour format
  };

  const localTimeString = date.toLocaleString(undefined, options);

  // Rearrange the date to "YYYY-MM-DD HH:mm" format
  const [month, day, year] = localTimeString.split(', ')[0].split('/');
  const time = localTimeString.split(', ')[1];

  return `${year}-${month}-${day} ${time}`;
};
