import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Rating,
  Typography,
} from "@mui/material";
import SpeakerIcon from "@mui/icons-material/Speaker";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import AlbumIcon from "@mui/icons-material/Album";
import MusicVideoIcon from "@mui/icons-material/MusicVideo";
import TuneIcon from "@mui/icons-material/Tune";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import { Link, useParams } from "react-router-dom";
import ImageMasonry from "../common/ImageMasonry";
import { getDj, updateFavoriteStatus,addCalificacion } from "../../api/djsApi.js";
import { getReservas, addReserva } from "../../api/reservaApi.js";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import Loader from "../common/Loader.jsx";
import FavoriteButton from "../common/Favorite.jsx";
import { ToastContainer, toast } from "react-toastify";  
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Calendar } from 'react-date-range';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.default",
  border: "1px solid var(--text-color)",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const getRandomIcon = () => {
  const icons = [
    <SpeakerIcon />,
    <LibraryMusicIcon />,
    <AudiotrackIcon />,
    <AlbumIcon />,
    <MusicVideoIcon />,
    <TuneIcon />,
    <EqualizerIcon />,
    <PlaylistAddCheckCircleIcon />,
  ];
  const randomIndex = Math.floor(Math.random() * icons.length);
  return icons[randomIndex];
};

const DjDetail = () => {
  const { id } = useParams();
  const [dj, setDj] = useState();
  const [djImages, setDjImages] = useState();
  const [open, setOpen] = useState(false);
  const { handleLogout, user, isLogged } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [ratingValue, setRatingValue] = useState(0);
  const { userDb, djCalificados,djFavorites, loadDjsCalificados } = useContext(AuthContext);
  

  const handleCalendarOpen = () => {
    setOpenCalendar(true);
  };
  
  const handleCalendarClose = () => {
    setOpenCalendar(false);
  };
  
  const handleReservar = async () => {
    try {
      const reserva = {
        fecha: selectedDate, 
        dj: dj.id,
        usuario: 1,
      };
  
      const response = await addReserva(reserva);
      if (response && response.status === 201) {
        toast.success("¡Reserva realizada con éxito!");
        handleCalendarClose();
      } else {
        console.error("Error al realizar la reserva");
        toast.error("Hubo un error al realizar la reserva");
      }
    } catch (error) {
      console.error("Error al realizar la reserva", error);
      toast.error("Hubo un error al realizar la reserva");
    }
  };

  const handleCalificar = async (event,value) => {
    let calificacion = value
    setRatingValue(calificacion);
    const data = {
      dj:dj.id,
      calificacion,
      usuario:userDb.id
    }

    const response = await addCalificacion(data);
    if(response){
      loadDjsCalificados();
    }
    else{
      alert("Ha ocurrido un error")
    }
  };  
  
  const isAdmin = user.rol === import.meta.env.VITE_ADMIN_ROL;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const imagesDj = () => {
    const arrayImg = [];
    for (let i = 1; i <= 5; i++) {
      const imgKey = `urlImg${i}`;
      arrayImg.push(dj[imgKey]);
    }
    return arrayImg;
  };

  const loadDj = async () => {
    const data = await getDj(id);
    if (data) {
      setDj(data);
    }
  };

  const loadCalificacion = async () => {
    const calificacion = djCalificados.find((d)=>d.dj.id==dj.id && d.usuario.id==userDb.id );
    setRatingValue(calificacion ? calificacion.calificacion : 0)
  };

  useEffect(() => {
    if (dj) setDjImages(imagesDj());

    if(userDb!=undefined && djFavorites.length>0 && dj){
      console.log(djFavorites)
      console.log(userDb)
      const favoriteCheck = djFavorites.some((f)=> f.dj.id==dj.id && f.usuario.id==userDb.id && f.favorite==true)
      setIsFavorite(favoriteCheck);
    } 

    

  }, [dj]);

  useEffect(() => {
    if (dj) loadCalificacion();
  }, [dj,djCalificados,userDb]);

  useEffect(() => {
    loadDj();
  }, []);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const reservas = await getReservas();
        if (reservas) {
          const formattedDates = reservas.map((reserva) => new Date(`${reserva.fecha}T04:00:00.000Z`));
          setAvailableDates(formattedDates);
        }
      } catch (error) {
        console.error("Error al obtener las reservas", error);
      }
    };
  
    if (openCalendar) {
      fetchReservas();
    }
  }, [openCalendar]);
  

  const toggleFavorite = async () => {
    const updatedStatus = !isFavorite;
    const value = {
      id: null,
      dj: dj.id,
      isFavorite: updatedStatus,
      usuario: 1,
    };
    const response = await updateFavoriteStatus(value);
    if (response.status === 201) {
      setIsFavorite(updatedStatus);
      toast.success("¡Se ha actualizado el estado de favorito!");
    } else {
      console.error("Error al actualizar el estado de favorito");
      toast.error("Hubo un error al actualizar el estado de favorito");
    }
  };
  

  if (!dj) return <Loader />;

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Box
            component="img"
            src={dj.urlPic}
            alt="Foto de perfil del Dj"
            borderRadius={3}
            sx={{
              maxWidth: "250px",
              maxHeight: "250px",
            }}
          />
          <Box>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                p: 1,
                minWidth: "300px",
                maxWidth: "500px",
              }}
            >
              <CardContent>
                <Box sx={{display: "flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
                  <Typography variant="h5">{`${dj.name} ${dj.lastname}`}</Typography>
                  {userDb && <FavoriteButton isFavorite={isFavorite} onClick={toggleFavorite} />}
                </Box>
                <hr />
                <Typography py={3}>{`PRECIO: $ ${dj.charge}`}</Typography>
                <Typography>CATEGORIA:</Typography>
                {dj.estilos.map((estilo) => {
                  return (
                    <Typography
                      key={estilo.style}
                      variant="body2"
                      pl={1}
                    >{`* ${estilo.style}`}</Typography>
                  );
                })}
                <Typography variant="body2" pt={3} pb={1}>
                  Sobre el DJ
                </Typography>
                <Typography variant="body2" pl={1}>
                  {dj.comment}
                </Typography>
                {userDb &&
                <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                  <Rating
                    name="simple-controlled"
                    size="large"
                    value={ratingValue}
                    readOnly={ratingValue>0}
                    onChange={handleCalificar}
                  />
                </Box>}
                <Typography variant="body1" pt={3} pb={1}>
                  Caracteristicas
                </Typography>
                {dj &&
                  dj.caracteristicas.map((caracteristica, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>{getRandomIcon()}</ListItemIcon>
                      <ListItemText primary={caracteristica.caracteristica} />
                    </ListItem>
                  ))}
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Card
            variant="outlined"
            sx={{ borderRadius: 3, p: 2, minWidth: "200px" }}
          >
            <CardContent sx={{ pb: 0 }}>
              {djImages && <ImageMasonry images={djImages} />}
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                sx={{ width: "100%", mb: 1 }}
                onClick={handleOpen}
              >
                Ver todas
              </Button>
            </CardActions>
          </Card>
          <Button
            variant="contained"
            size="large"
            sx={{ width: "100%", my: 2 }}
            onClick={handleCalendarOpen}
          >
            RESERVAR
          </Button>
        </Grid>

        {/* ---------- Modal de galeria de imagenes ---------- */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              mb={2}
            >
              {`${dj.name} ${dj.lastname}`}
            </Typography>
            <ImageMasonry images={djImages} />
          </Box>
        </Modal>


        {/* Modal reserva */}

        <Modal
          open={openCalendar}
          onClose={handleCalendarClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              mb={2}
            >
              {`${dj.name} ${dj.lastname}`}
            </Typography>
            <Calendar
              date={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
              disabledDates={availableDates}
              color="#f50057"
              months={2}
              direction="horizontal"
            />

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleCalendarClose} sx={{ mr: 2 }}>Cancelar</Button>
              <Button variant="contained" onClick={handleReservar}>Reservar</Button>
            </Box>
          </Box>
        </Modal>

      </Grid>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Container>
  );
};

export default DjDetail;
