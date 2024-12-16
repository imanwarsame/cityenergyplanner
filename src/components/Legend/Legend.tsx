import { Box, Group, Text } from '@mantine/core';

export default function Legend() {
  const legendData = [
    { type: 'Commercial', color: '#33c7ff' },
    { type: 'Train Station', color: '#FFCFEF' },
    { type: 'Apartments', color: '#00ff00' },
    { type: 'Residential', color: '#00ff00' },
    { type: 'School', color: '#D3F1DF' },
    { type: 'University', color: '#D3F1DF' },
    { type: 'Hospital', color: '#FF7F3E' },
    { type: 'Industrial', color: '#f03b20' },
    { type: 'Government', color: '#432E54' },
    { type: 'Public', color: '#432E54' },
    { type: 'Office', color: '#7E1891' },
    { type: 'Default', color: '#aaa' },
  ];

  return (
    <>
      {legendData.map((item) => (
        <Group key={item.type} gap="xs" mb="xs">
          <Box
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '3px',
              backgroundColor: item.color,
            }}
          />
          <Text size="sm">{item.type}</Text>
        </Group>
      ))}
    </>
  );
}
