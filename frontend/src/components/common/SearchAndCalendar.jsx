import { useState } from 'react'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import SearchInput from "../common/SearchInput2";

const ciudades = [
    { id: 1, ciudad: 'La Plata' },
    { id: 2, ciudad: 'Mar del Plata' },
    { id: 3, ciudad: 'Bahía Blanca' },
    { id: 4, ciudad: 'Tandil' },
    { id: 5, ciudad: 'Buenos Aires' },
    { id: 6, ciudad: 'San Fernando del Valle de Catamarca' },
    { id: 7, ciudad: 'Andalgalá' },
    { id: 8, ciudad: 'Resistencia' },
    { id: 9, ciudad: 'Presidencia Roque Sáenz Peña' },
    { id: 10, ciudad: 'Rawson' },
    { id: 11, ciudad: 'Comodoro Rivadavia' },
    { id: 12, ciudad: 'Córdoba' },
    { id: 13, ciudad: 'Villa Carlos Paz' },
    { id: 14, ciudad: 'Corrientes' },
    { id: 15, ciudad: 'Goya' },
    { id: 16, ciudad: 'Paraná' },
    { id: 17, ciudad: 'Concordia' },
    { id: 18, ciudad: 'Formosa' },
    { id: 19, ciudad: 'Clorinda' },
    { id: 20, ciudad: 'San Salvador de Jujuy' },
    { id: 21, ciudad: 'Palpalá' },
    { id: 22, ciudad: 'Santa Rosa' },
    { id: 23, ciudad: 'General Pico' },
    { id: 24, ciudad: 'La Rioja' },
    { id: 25, ciudad: 'Chilecito' },
    { id: 26, ciudad: 'Mendoza' },
    { id: 27, ciudad: 'San Rafael' },
    { id: 28, ciudad: 'Posadas' },
    { id: 29, ciudad: 'Oberá' },
    { id: 30, ciudad: 'Neuquén' },
    { id: 31, ciudad: 'San Martín de los Andes' },
    { id: 32, ciudad: 'Viedma' },
    { id: 33, ciudad: 'San Carlos de Bariloche' },
    { id: 34, ciudad: 'Salta' },
    { id: 35, ciudad: 'San Ramón de la Nueva Orán' },
    { id: 36, ciudad: 'San Juan' },
    { id: 37, ciudad: 'San Luis' },
    { id: 38, ciudad: 'Villa Mercedes' },
    { id: 39, ciudad: 'Río Gallegos' },
    { id: 40, ciudad: 'Caleta Olivia' },
    { id: 41, ciudad: 'Santa Fe' },
    { id: 42, ciudad: 'Rosario' },
    { id: 43, ciudad: 'Santiago del Estero' },
    { id: 44, ciudad: 'La Banda' },
    { id: 45, ciudad: 'Ushuaia' },
    { id: 46, ciudad: 'Río Grande' },
    { id: 47, ciudad: 'San Miguel de Tucumán' },
    { id: 48, ciudad: 'Tafí Viejo' }
];

function SearchAndCalendar() {
  const [categories, setCategories] = useState(ciudades);


  //estados del calendario
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection'
  }

  //manejo de los estados del calendario
  const handleDateSelect = (ranges) => {
    setStartDate (ranges.selection.startDate);
    setEndDate (ranges.selection.endDate);
  }

  //botón reset
  const resetInput = () => {
    setSearchItem('')
  }


  return (
    <>
      <SearchInput
            ciudades={ciudades.map((ciudad) => {
              return ciudad.ciudad;
            })}
      />
      {SearchInput && (
        <div>
          <DateRange ranges={[selectionRange]}
          minDate={new Date()}
          rangeColors={["#160526"]}
          onChange={handleDateSelect}
          />
          <div className="flex">
            <button onClick={resetInput} className='flex-grow text-gray-500'>cancelar</button>
            <button className='flex-grow'>buscar</button>
          </div>
        </div>
        
      )}
    </>
  )
}

export default SearchAndCalendar