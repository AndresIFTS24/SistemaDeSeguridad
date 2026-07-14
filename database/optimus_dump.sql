-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: b5eh2lcow6pboy6bneaw-mysql.services.clever-cloud.com:3306
-- Generation Time: Jul 14, 2026 at 02:11 PM
-- Server version: 8.4.2-2
-- PHP Version: 8.2.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `b5eh2lcow6pboy6bneaw`
--

-- --------------------------------------------------------

--
-- Table structure for table `ABONADOS`
--

CREATE TABLE `ABONADOS` (
  `ID_Abonado` int NOT NULL,
  `NumeroDeAbonado` varchar(20) NOT NULL,
  `RazonSocial` varchar(150) NOT NULL,
  `RUT` varchar(20) DEFAULT NULL,
  `ContactoPrincipal` varchar(100) DEFAULT NULL,
  `TelefonoContacto` varchar(25) DEFAULT NULL,
  `EmailContacto` varchar(100) DEFAULT NULL,
  `FechaAlta` datetime DEFAULT CURRENT_TIMESTAMP,
  `Activo` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ABONADOS`
--

INSERT INTO `ABONADOS` (`ID_Abonado`, `NumeroDeAbonado`, `RazonSocial`, `RUT`, `ContactoPrincipal`, `TelefonoContacto`, `EmailContacto`, `FechaAlta`, `Activo`) VALUES
(2, '1002', 'Rodríguez e Hijos SRL', '30-45667788-9', 'Ricardo Rodríguez', '11-5566-7788', 'contacto@rodriguez.com', '2025-01-12 00:00:00', 1),
(3, '1003', 'Estancia La Blanqueada', '27-11223344-5', 'María Elena González', '1136493130', 'administracion@lablanqueada.com', '2025-01-15 00:00:00', 1),
(4, '1004', 'Schmidt & Co.', '30-99887766-4', 'Walter Schmidt', '11-3322-1100', 'w.schmidt@global.de', '2025-01-18 00:00:00', 1),
(6, '1006', 'Rossi Repuestos', '33-44556677-2', 'Franco Rossi', '11-9988-7766', 'ventas@rossi-repuestos.it', '2025-01-22 00:00:00', 1),
(7, '1007', 'Supermercado Wong', '30-12345678-0', 'Lin Wong', '11-4433-2211', 'gerencia@wong.com.ar', '2025-01-25 00:00:00', 1),
(8, '1008', 'Panadería Los Amigos', '27-55443322-1', 'Patricia Sosa', '11-8877-6655', 'patricia.sosa@live.com', '2025-01-26 00:00:00', 1),
(9, '1009', 'Consorcio Calle Florida', '30-77665544-3', 'Alberto Fernández', '11-2233-4455', 'consorcioflorida@gmail.com', '2025-01-28 00:00:00', 1),
(10, '1010', 'López & Asociados', '20-88990011-2', 'Santiago López', '11-5544-3322', 'santiago@lopez-asoc.com.ar', '2025-02-01 00:00:00', 1),
(11, '1011', 'Taller El Alemán', '20-13572468-9', 'Hans Müller', '11-2468-1357', 'muller@taller-aleman.com', '2025-02-03 00:00:00', 1),
(12, '1012', 'Boutique Sofía', '27-98765432-1', 'Sofía Lorenzi', '11-4567-8901', 'hola@sofia-boutique.com', '2025-02-05 00:00:00', 1),
(13, '1013', 'Gimnasio IronBox', '30-11223344-9', 'Marcos Giménez', '11-3214-5678', 'ironbox@gym.com', '2025-02-07 00:00:00', 1),
(14, '1014', 'Ferretería Central', '30-55667788-1', 'Jorge Domínguez', '11-7890-1234', 'ventas@ferreycentral.com', '2025-02-08 00:00:00', 1),
(15, '1015', 'Clínica del Sol', '30-22334455-6', 'Dra. Ana Bianchi', '11-6543-2109', 'emergencias@clinicasol.com.ar', '2025-02-10 00:00:00', 1),
(16, '1016', 'Restaurante Don Julio', '20-33445566-0', 'Pablo Rivero', '11-4775-1888', 'reservas@donjulio.com', '2025-02-12 00:00:00', 1),
(17, '1017', 'Lavadero El Burbujeo', '27-44556677-4', 'Carmen Herrera', '11-3344-5566', 'burbujeo@outlook.com', '2025-02-14 00:00:00', 1),
(18, '1018', 'Distribuidora Arcoriz', '30-66778899-5', 'Luis Caputo', '11-5566-7788', 'lcaputo@arcoriz.com.ar', '2025-02-15 00:00:00', 1),
(19, '1019', 'Zapatería StepUp', '20-77889900-3', 'Marcelo Tinelli', '11-6677-8899', 'ventas@stepup.com', '2025-02-18 00:00:00', 1),
(20, '1020', 'Hotel Alvear', '30-88990011-7', 'Gerencia General', '11-4808-2100', 'seguridad@alvear.com.ar', '2025-02-20 00:00:00', 1),
(21, '1021', 'Vidriería San José', '20-11112222-3', 'José Díaz', '11-2222-3333', 'vidrierasanjose@gmail.com', '2025-02-21 00:00:00', 1),
(22, '1022', 'PetShop Huellitas', '27-33334444-5', 'Valeria Mazza', '11-4444-5555', 'valeria@huellitas.com', '2025-02-22 00:00:00', 1),
(23, '1023', 'Inmobiliaria Delta', '30-55556666-7', 'Sergio Massa', '11-6666-7777', 'smassa@deltaprop.com', '2025-02-23 00:00:00', 1),
(24, '1024', 'Librería El Ateneo', '30-77778888-9', 'Encargado Turno', '11-8888-9999', 'seguridad@elateneo.com', '2025-02-24 00:00:00', 1),
(25, '1025', 'Peluquería Giordano', '20-99990000-1', 'Roberto Giordano', '11-0000-1111', 'roberto@giordano.com', '2025-02-25 00:00:00', 1),
(26, '1026', 'Farmacia La Botica', '27-12123434-5', 'Mirtha Legrand', '11-2323-4545', 'mirtha@labotica.com', '2025-02-26 00:00:00', 1),
(27, '1027', 'Pizzería Guerrín', '30-56567878-9', 'Maestro Pizzero', '11-4371-8414', 'guerrin@pizzas.com', '2025-02-27 00:00:00', 1),
(28, '1028', 'Transportes Moyano', '20-10102020-3', 'Hugo Moyano', '11-3030-4040', 'hugo@camioneros.com', '2025-02-28 00:00:00', 1),
(29, '1029', 'Café Tortoni', '30-11110000-5', 'Gerente Tortoni', '11-4342-4328', 'tortoni@cafe.com', '2025-03-01 00:00:00', 1),
(30, '1030', 'Kiosco Open25', '30-22221111-7', 'Empleado Open', '11-5555-4444', 'seguridad@open25.com', '2025-03-02 00:00:00', 1),
(312, '1032', 'Sushi Flower', '30-67678989-1', 'Yuki Tanaka', '11-7878-9090', 'tanaka@sushiflower.jp', '2025-03-04 00:00:00', 1),
(313, '1033', 'Textil Avellaneda', '30-12312312-3', 'Abraham Levy', '11-3434-1212', 'alevy@textilav.com', '2025-03-05 00:00:00', 1),
(314, '1034', 'Carniceria El Res', '20-99881122-4', 'Beto Casella', '11-6655-4433', 'beto@elres.com', '2025-03-06 00:00:00', 1),
(315, '1035', 'Libreria Cúspide', '30-44551122-6', 'Gerente Ventas', '11-2211-3344', 'cuspide@libros.com', '2025-03-07 00:00:00', 1),
(316, '1036', 'Optica Vision', '27-88776655-0', 'Luciana Salazar', '11-0099-8877', 'luciana@vision.com', '2025-03-08 00:00:00', 1),
(317, '1037', 'Vivero Mis Flores', '27-22331144-8', 'Rosa Espinoza', '11-5566-1122', 'rosa@vivero.com', '2025-03-09 00:00:00', 1),
(318, '1038', 'Insumos Industriales S.A', '30-44332211-9', 'Carlos Tevez', '11-3232-4545', 'tevez@insumos.com.ar', '2025-03-10 00:00:00', 1),
(319, '1039', 'Consultora Iturri', '30-99008877-5', 'Sebastian Iturri', '11-1212-3434', 'info@iturri.com', '2025-03-11 00:00:00', 1),
(320, '1040', 'Pinturerias Rex', '30-55661100-2', 'Damián Kuc', '11-7788-9900', 'seguridad@rex.com', '2025-03-12 00:00:00', 1),
(321, '1041', 'Pastas La Nonna', '27-14147878-3', 'Silvia Rossi', '11-3344-9988', 'rossi@lanonna.com', '2025-03-13 00:00:00', 1),
(322, '1042', 'Cerrajería El Pájaro', '20-66778899-0', 'Claudio Caniggia', '11-7788-2233', 'caniggia@cerrajeria.com', '2025-03-14 00:00:00', 1),
(323, '1043', 'Barrio Cerrado El Sol', '30-11992288-7', 'Intendente Barrio', '11-4455-0011', 'seguridad@elsol.com', '2025-03-15 00:00:00', 1),
(324, '1044', 'Laboratorios Pfizer', '30-44115522-3', 'Gerente Seguridad', '11-2233-6677', 'pfizer@security.com', '2025-03-16 00:00:00', 1),
(325, '1045', 'Joyeria Bulgari', '30-12344321-9', 'Valentino Garavani', '11-9900-1122', 'valentino@bulgari.it', '2025-03-17 00:00:00', 1),
(326, '1046', 'Fiambreria El Queso', '20-33332222-1', 'Oscar Ruggeri', '11-1234-5678', 'cabezon@elqueso.com', '2025-03-18 00:00:00', 1),
(327, '1047', 'Heladeria Freddo', '30-12128899-4', 'Supervisor Local', '11-5544-2211', 'freddo@ventas.com', '2025-03-19 00:00:00', 1),
(328, '1048', 'Muebles Valenziana', '30-99884433-2', 'Hector Valenzuela', '11-4455-6611', 'hvalenzuela@muebles.com', '2025-03-20 00:00:00', 1),
(329, '1049', 'Electrica Rivadavia', '30-55447788-1', 'Juan Jose Campanella', '11-7788-1122', 'campanella@elec.com', '2025-03-21 00:00:00', 1),
(330, '1050', 'Agencia de Viajes S.A', '30-11225588-6', 'Marley Wiebe', '11-9911-2233', 'marley@viajes.com', '2025-03-22 00:00:00', 1),
(331, '1051', 'Lavadero Speed', '20-66771144-9', 'Lewis Hamilton', '11-4455-1100', 'hamilton@speed.com', '2025-03-23 00:00:00', 1),
(332, '1052', 'Colegio San Martin', '30-44559988-2', 'Director General', '11-2233-1199', 'admin@sanmartin.edu.ar', '2025-03-24 00:00:00', 1),
(333, '1053', 'Frigorifico El 10', '30-10101010-1', 'Diego Maradona', '11-1010-1010', 'diego@el10.com', '2025-03-25 00:00:00', 1),
(334, '1054', 'Bazar El Chino', '30-99112233-8', 'Chen Min', '11-2233-4455', 'chen@bazar.com', '2025-03-26 00:00:00', 1),
(335, '1055', 'Kiosco Diarco', '30-12341234-7', 'Roberto Galan', '11-4455-1234', 'galan@diarco.com', '2025-03-27 00:00:00', 1),
(336, '1056', 'Sindicato de Comercio', '30-44112233-4', 'Armando Cavalieri', '11-5566-7788', 'cavalieri@sindicato.org', '2025-03-28 00:00:00', 1),
(337, '1057', 'Bar El Federal', '30-99881177-3', 'Carlos Calvo', '11-3344-1122', 'carlin@elfederal.com', '2025-03-29 00:00:00', 1),
(338, '1058', 'Peluqueria Pancho', '20-11447788-1', 'Pancho Dotto', '11-2233-4411', 'dotto@models.com', '2025-03-30 00:00:00', 1),
(339, '1059', 'Garage Central', '30-55441199-6', 'Mario Pergolini', '11-9988-1122', 'mario@vorterix.com', '2025-03-31 00:00:00', 1),
(340, '1060', 'Drogueria Del Sud', '30-11442255-8', 'Gerente Logistica', '11-1122-3344', 'seguridad@delsud.com', '2025-04-01 00:00:00', 1),
(341, '1061', 'Estudio Juridico Burlando', '20-33441122-5', 'Fernando Burlando', '11-4411-2233', 'fernando@burlando.com', '2025-04-02 00:00:00', 1),
(342, '1062', 'Bodegas Chandon', '30-11229944-1', 'Bernardo Neustadt', '11-4455-1122', 'bneustadt@bodegas.com', '2025-04-03 00:00:00', 1),
(343, '1063', 'Cine Hoyts', '30-99882244-7', 'Gerente Complejo', '11-0011-2233', 'hoyts@security.com', '2025-04-04 00:00:00', 1),
(344, '1064', 'Club River Plate', '30-11441144-9', 'Jorge Brito', '11-4771-1122', 'seguridad@river.com.ar', '2025-04-05 00:00:00', 1),
(345, '1065', 'Club Boca Juniors', '30-12121212-3', 'Juan Roman Riquelme', '11-4309-4700', 'riquelme@boca.com.ar', '2025-04-06 00:00:00', 1),
(346, '1066', 'La Serenisima', '30-44119922-5', 'Pascual Mastellone', '11-4455-2233', 'mastellone@leche.com', '2025-04-07 00:00:00', 1),
(347, '1067', 'Techint S.A', '30-11994422-7', 'Paolo Rocca', '11-4433-2211', 'paolo@techint.com', '2025-04-08 00:00:00', 1),
(348, '1068', 'Cerveceria Quilmes', '30-11559922-1', 'Brahma Supervisor', '11-4433-1122', 'seguridad@quilmes.com', '2025-04-09 00:00:00', 1),
(349, '1069', 'Banco Galicia', '30-11223344-0', 'Gerente Sucursal', '11-4455-6677', 'galicia@security.com', '2025-04-10 00:00:00', 1),
(350, '1070', 'Musimundo', '30-99881122-0', 'Ventas Central', '11-1122-3344', 'seguridad@musimundo.com', '2025-04-11 00:00:00', 1),
(351, '1071', 'Adidas Argentina', '30-44112255-0', 'Lionel Messi', '11-1010-2025', 'messi@adidas.com', '2025-04-12 00:00:00', 1),
(352, '1072', 'Nike Store', '30-12349988-0', 'Michael Jordan', '11-2323-4545', 'jordan@nike.com', '2025-04-13 00:00:00', 1),
(353, '1073', 'McDonalds Obelisco', '30-44119988-0', 'Ronald Mc', '11-4455-1212', 'obelisco@mcdonalds.com', '2025-04-14 00:00:00', 1),
(354, '1074', 'Starbucks Palermo', '30-11441122-0', 'Barista Jefe', '11-5544-3322', 'palermo@starbucks.com', '2025-04-15 00:00:00', 1),
(355, '1075', 'Burger King Centro', '30-99112288-0', 'Rey Burger', '11-2233-4455', 'centro@burgerking.com', '2025-04-16 00:00:00', 1),
(356, '1076', 'YPF Central', '30-11223344-1', 'Gerente Operaciones', '11-4455-1100', 'ypf@seguridad.com', '2025-04-17 00:00:00', 1),
(357, '1077', 'Shell Dock Sud', '30-44551122-1', 'Supervisor Planta', '11-1122-3344', 'shell@security.com', '2025-04-18 00:00:00', 1),
(358, '1078', 'Axion Energy', '30-99112244-1', 'Ingeniero Jefe', '11-4455-1122', 'axion@energy.com', '2025-04-19 00:00:00', 1),
(359, '1079', 'Toyota Argentina', '30-11229988-1', 'Gerente Planta', '11-4455-1133', 'toyota@seguridad.com', '2025-04-20 00:00:00', 1),
(360, '1080', 'Ford Pilar', '30-44115599-1', 'Supervisor Ford', '11-1122-3355', 'ford@security.com', '2025-04-21 00:00:00', 1),
(361, '1081', 'Volkswagen Tigre', '30-99112266-1', 'Jefe de Planta', '11-4455-1144', 'vw@seguridad.com', '2025-04-22 00:00:00', 1),
(362, '1082', 'Fiat Palomar', '30-11223377-1', 'Gerente Fiat', '11-4455-1155', 'fiat@security.com', '2025-04-23 00:00:00', 1),
(363, '1083', 'Peugeot Argentina', '30-44119933-1', 'Supervisor Peugeot', '11-1122-3366', 'peugeot@seguridad.com', '2025-04-24 00:00:00', 1),
(364, '1084', 'Renault Santamaria', '30-99112255-1', 'Jefe de Seguridad', '11-4455-1166', 'renault@security.com', '2025-04-25 00:00:00', 1),
(365, '1085', 'Mercado Libre', '30-11223344-2', 'Marcos Galperin', '11-4455-1177', 'marcos@mercadolibre.com', '2025-04-26 00:00:00', 1),
(366, '1086', 'Globant Tower', '30-44115522-2', 'Martin Migoya', '11-1122-3377', 'martin@globant.com', '2025-04-27 00:00:00', 1),
(367, '1087', 'Ualá S.A', '30-99112211-2', 'Pierpaolo Barbieri', '11-4455-1188', 'pier@uala.com', '2025-04-28 00:00:00', 1),
(368, '1088', 'Despegar.com', '30-11223399-2', 'Roberto Souviron', '11-4455-1199', 'roberto@despegar.com', '2025-04-29 00:00:00', 1),
(369, '1089', 'Tienda Nube', '30-44119911-2', 'Gerente TI', '11-1122-3388', 'tiendanube@security.com', '2025-04-30 00:00:00', 1),
(370, '1090', 'Auth0', '30-99112277-2', 'Matias Woloski', '11-4455-1200', 'matias@auth0.com', '2025-05-01 00:00:00', 1),
(371, '1091', 'Personal Flow', '30-11223355-2', 'Gerente Redes', '11-4455-1211', 'flow@security.com', '2025-05-02 00:00:00', 1),
(372, '1092', 'Movistar Argentina', '30-44115544-2', 'Supervisor Movistar', '11-1122-3399', 'movistar@seguridad.com', '2025-05-03 00:00:00', 1),
(373, '1093', 'Claro S.A', '30-99112288-2', 'Jefe de Sistemas', '11-4455-1222', 'claro@security.com', '2025-05-04 00:00:00', 1),
(374, '1094', 'DirectTV Argentina', '30-11223366-2', 'Gerente Planta', '11-4455-1233', 'directv@seguridad.com', '2025-05-05 00:00:00', 1),
(375, '1095', 'Cablevision', '30-44119955-2', 'Supervisor Cable', '11-1122-3411', 'cable@security.com', '2025-05-06 00:00:00', 1),
(376, '1096', 'Edenor S.A', '30-99112299-2', 'Gerente Electrico', '11-4455-1244', 'edenor@seguridad.com', '2025-05-07 00:00:00', 1),
(377, '1097', 'Edesur S.A', '30-11223388-2', 'Supervisor Edesur', '11-4455-1255', 'edesur@security.com', '2025-05-08 00:00:00', 1),
(378, '1098', 'Metrogas S.A', '30-44119977-2', 'Jefe de Segurity', '11-1122-3422', 'metrogas@seguridad.com', '2025-05-09 00:00:00', 1),
(379, '1099', 'AySA S.A', '30-99112200-2', 'Gerente Agua', '11-4455-1266', 'aysa@security.com', '2025-05-10 00:00:00', 1),
(380, '1100', 'Aerolineas Argentinas', '30-11223344-3', 'Gerente Seguridad', '11-4455-1277', 'seguridad@aerolineas.com', '2025-05-11 00:00:00', 1),
(382, '1101', 'Empresa de Prueba SA', '30-99999999-1', 'Liliana Alvarez', '11-1234-5678', 'prueba@empresa.com', '2026-05-20 02:59:26', 1),
(383, '1109', 'Perozii Fiambreria', '27-95814734-1', 'Alexandra', '11-2383-7645', 'lialvarez0630@gmaiil.com', '2026-05-20 22:42:20', 1),
(384, '1112', 'Elixir S.A', '30-12345678-5', 'Marcos Arenales', '11-4455-6677', 'contacto@gmail.com', '2026-05-20 23:12:12', 1),
(385, '1110', 'Pepito Perez', '1234569765', 'lcarpe@gmail.com', '11-6679-8757', 'lcarpe@gmail.com', '2026-06-10 23:33:09', 1),
(387, '1118', 'Freddos S.A', '30-24495479-1', 'Mauricio Freddos', '1123786709', 'Mgerencia@freddos.com.ar', '2026-07-08 18:10:54', 1),
(388, '1120', 'Aklex Indumentaria', '27-95817737-2', 'Marcela Quiroga', '15-8976-4537', 'Mquiroga@gmail.com', '2026-07-08 20:50:30', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ASIGNACIONES`
--

CREATE TABLE `ASIGNACIONES` (
  `ID_Asignacion` int NOT NULL,
  `ID_Direccion` int NOT NULL,
  `ID_Tecnico` int NOT NULL,
  `TipoOT` varchar(50) NOT NULL,
  `Descripcion` text,
  `FechaProgramada` datetime NOT NULL,
  `FechaInicioReal` datetime DEFAULT NULL,
  `FechaFinReal` datetime DEFAULT NULL,
  `Estado` varchar(20) NOT NULL DEFAULT 'Programada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ASIGNACIONES`
--

INSERT INTO `ASIGNACIONES` (`ID_Asignacion`, `ID_Direccion`, `ID_Tecnico`, `TipoOT`, `Descripcion`, `FechaProgramada`, `FechaInicioReal`, `FechaFinReal`, `Estado`) VALUES
(2, 100, 37, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-07-18 13:39:01', NULL, NULL, 'Programada'),
(3, 97, 41, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-06-28 10:41:59', '2026-06-28 10:41:59', NULL, 'En Curso'),
(4, 95, 28, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-08-28 15:47:31', '2025-08-28 15:47:31', '2025-08-28 20:47:31', 'Finalizada'),
(5, 94, 21, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-04-20 05:59:47', '2026-04-20 05:59:47', '2026-04-20 07:59:47', 'Finalizada'),
(6, 92, 25, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-06-30 14:07:11', '2026-06-30 14:07:11', NULL, 'En Curso'),
(7, 96, 44, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-01-10 11:41:48', '2026-01-10 11:41:48', '2026-01-10 17:41:48', 'Finalizada'),
(8, 89, 26, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-09-30 04:30:35', '2025-09-30 04:30:35', '2025-09-30 10:30:35', 'Finalizada'),
(9, 88, 40, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-10-19 04:40:16', '2025-10-19 04:40:16', '2025-10-19 06:40:16', 'Finalizada'),
(10, 91, 42, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-05-21 05:43:53', '2025-05-21 05:43:53', '2025-05-21 09:43:53', 'Finalizada'),
(11, 93, 30, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-06-25 06:55:48', '2026-06-25 06:55:48', NULL, 'En Curso'),
(12, 84, 33, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-09-28 15:13:33', '2025-09-28 15:13:33', '2025-09-28 19:13:33', 'Finalizada'),
(13, 87, 25, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-06-26 04:41:39', '2026-06-26 04:41:39', NULL, 'En Curso'),
(14, 90, 34, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-05-23 05:47:20', '2026-05-23 05:47:20', '2026-05-23 08:47:20', 'Finalizada'),
(15, 82, 34, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-12-12 09:53:25', '2025-12-12 09:53:25', '2025-12-12 15:53:25', 'Finalizada'),
(16, 79, 34, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-08-13 09:36:45', '2025-08-13 09:36:45', '2025-08-13 11:36:45', 'Finalizada'),
(17, 85, 24, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-11-27 07:35:15', '2025-11-27 07:35:15', '2025-11-27 09:35:15', 'Finalizada'),
(18, 81, 42, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-06-25 16:40:28', '2026-06-25 16:40:28', NULL, 'En Curso'),
(19, 83, 45, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-06-10 23:07:17', '2025-06-10 23:07:17', '2025-06-11 04:07:17', 'Finalizada'),
(20, 77, 35, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-07-06 05:15:47', NULL, NULL, 'Programada'),
(21, 75, 21, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-08-12 21:59:48', '2025-08-12 21:59:48', '2025-08-12 23:59:48', 'Finalizada'),
(22, 80, 43, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-01-10 09:00:11', '2026-01-10 09:00:11', '2026-01-10 15:00:11', 'Finalizada'),
(23, 71, 30, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-02-15 20:46:39', '2026-02-15 20:46:39', '2026-02-15 23:46:39', 'Finalizada'),
(24, 78, 43, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-06-16 08:56:43', '2026-06-16 08:56:43', '2026-06-16 10:56:43', 'Finalizada'),
(25, 76, 42, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-07-28 08:14:15', '2025-07-28 08:14:15', '2025-07-28 10:14:15', 'Finalizada'),
(26, 70, 36, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-06-27 21:20:21', '2026-06-27 21:20:21', NULL, 'En Curso'),
(27, 73, 44, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-10-06 07:31:24', '2025-10-06 07:31:24', '2025-10-06 13:31:24', 'Finalizada'),
(28, 68, 42, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-05-26 16:23:19', '2026-05-26 16:23:19', '2026-05-26 18:23:19', 'Finalizada'),
(29, 72, 29, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-07-05 07:08:37', NULL, NULL, 'Programada'),
(30, 69, 23, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-06-04 23:56:14', '2025-06-04 23:56:14', '2025-06-05 02:56:14', 'Finalizada'),
(31, 63, 30, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-11-22 08:40:38', '2025-11-22 08:40:38', '2025-11-22 12:40:38', 'Finalizada'),
(32, 65, 27, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-07-02 13:42:24', NULL, NULL, 'Programada'),
(33, 66, 28, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-06-26 23:13:28', '2026-06-26 23:13:28', NULL, 'En Curso'),
(34, 64, 43, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-01-10 15:58:29', '2026-01-10 15:58:29', '2026-01-10 19:58:29', 'Finalizada'),
(35, 62, 29, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-06-28 17:08:24', '2026-06-28 17:08:24', NULL, 'En Curso'),
(36, 67, 44, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-03-29 04:11:35', '2026-03-29 04:11:35', '2026-03-29 06:11:35', 'Finalizada'),
(37, 60, 40, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-07-20 04:51:17', NULL, NULL, 'Programada'),
(38, 59, 27, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-06-17 06:33:14', '2025-06-17 06:33:14', '2025-06-17 12:33:14', 'Finalizada'),
(39, 61, 43, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-04-24 22:47:50', '2025-04-24 22:47:50', '2025-04-25 00:47:50', 'Finalizada'),
(40, 56, 27, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-08-22 20:24:58', '2025-08-22 20:24:58', '2025-08-23 00:24:58', 'Finalizada'),
(41, 55, 23, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-10-30 14:26:30', '2025-10-30 14:26:30', '2025-10-30 20:26:30', 'Finalizada'),
(42, 54, 45, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-11-12 17:02:25', '2025-11-12 17:02:25', '2025-11-12 20:02:25', 'Finalizada'),
(43, 57, 37, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-06-11 10:48:08', '2025-06-11 10:48:08', '2025-06-11 13:48:08', 'Finalizada'),
(44, 58, 33, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-07-06 18:37:52', '2025-07-06 18:37:52', '2025-07-06 20:37:52', 'Finalizada'),
(45, 47, 24, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-10-10 09:59:09', '2025-10-10 09:59:09', '2025-10-10 12:59:09', 'Finalizada'),
(46, 52, 34, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-02-24 09:17:20', '2026-02-24 09:17:20', '2026-02-24 11:17:20', 'Finalizada'),
(47, 53, 23, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2026-06-30 01:47:38', '2026-06-30 01:47:38', NULL, 'En Curso'),
(48, 50, 39, 'Instalación', 'Instalación de equipo de seguridad electrónica — datos de prueba', '2025-11-03 00:45:24', '2025-11-03 00:45:24', '2025-11-03 05:45:24', 'Finalizada'),
(49, 34, 35, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-29 12:47:19', '2026-06-29 12:47:19', NULL, 'En Curso'),
(50, 29, 44, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-19 02:28:03', '2026-05-19 02:28:03', '2026-05-19 07:28:03', 'Finalizada'),
(51, 20, 38, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-09 08:37:22', '2026-05-09 08:37:22', '2026-05-09 13:37:22', 'Finalizada'),
(52, 69, 40, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-05 13:46:50', '2026-06-05 13:46:50', '2026-06-05 16:46:50', 'Finalizada'),
(53, 39, 41, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-28 22:46:51', '2026-06-28 22:46:51', NULL, 'En Curso'),
(54, 36, 42, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-09 00:51:04', NULL, NULL, 'Programada'),
(55, 28, 38, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-05 08:34:14', NULL, NULL, 'Programada'),
(56, 22, 34, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-03 18:49:44', '2026-02-03 18:49:44', '2026-02-03 22:49:44', 'Finalizada'),
(57, 87, 43, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-30 14:48:27', '2026-05-30 14:48:27', '2026-05-30 17:48:27', 'Finalizada'),
(58, 62, 27, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-10 00:22:20', NULL, NULL, 'Programada'),
(59, 21, 29, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-08 10:00:14', '2026-02-08 10:00:14', '2026-02-08 13:00:14', 'Finalizada'),
(60, 7, 43, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-07 14:11:09', NULL, NULL, 'Programada'),
(61, 22, 32, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-16 15:23:25', '2026-05-16 15:23:25', '2026-05-16 20:23:25', 'Finalizada'),
(62, 94, 30, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-11 23:55:46', '2026-03-11 23:55:46', '2026-03-12 04:55:46', 'Finalizada'),
(63, 66, 25, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-14 20:45:46', '2026-04-14 20:45:46', '2026-04-15 01:45:46', 'Finalizada'),
(64, 2, 35, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-26 10:51:23', '2026-04-26 10:51:23', '2026-04-26 13:51:23', 'Finalizada'),
(65, 41, 39, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-18 05:02:26', '2026-05-18 05:02:26', '2026-05-18 11:02:26', 'Finalizada'),
(66, 53, 37, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-16 20:19:29', '2026-04-16 20:19:29', '2026-04-16 23:19:29', 'Finalizada'),
(67, 61, 33, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-11 02:01:25', '2026-05-11 02:01:25', '2026-05-11 07:01:25', 'Finalizada'),
(68, 52, 26, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-15 22:21:06', '2026-04-15 22:21:06', '2026-04-16 03:21:06', 'Finalizada'),
(69, 2, 35, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-10 08:56:42', '2026-03-10 08:56:42', '2026-03-10 14:56:42', 'Finalizada'),
(70, 66, 23, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-28 12:16:22', '2026-06-28 12:16:22', NULL, 'En Curso'),
(71, 93, 31, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-01-21 08:22:56', '2026-01-21 08:22:56', '2026-01-21 10:22:56', 'Finalizada'),
(72, 93, 32, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-06 19:25:40', '2026-05-06 19:25:40', '2026-05-06 23:25:40', 'Finalizada'),
(73, 71, 35, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-10 16:06:27', '2026-05-10 16:06:27', '2026-05-10 21:06:27', 'Finalizada'),
(74, 34, 38, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-01-16 09:18:00', '2026-01-16 09:18:00', '2026-01-16 14:18:00', 'Finalizada'),
(75, 10, 28, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-01-18 18:13:05', '2026-01-18 18:13:05', '2026-01-18 21:13:05', 'Finalizada'),
(76, 67, 34, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-12 15:24:05', NULL, NULL, 'Programada'),
(77, 27, 40, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-03 12:55:57', NULL, NULL, 'Programada'),
(78, 16, 26, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-10 04:55:09', '2026-04-10 04:55:09', '2026-04-10 09:55:09', 'Finalizada'),
(79, 97, 45, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-03 11:55:22', '2026-05-03 11:55:22', '2026-05-03 15:55:22', 'Finalizada'),
(80, 33, 42, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-08 08:17:03', '2026-06-08 08:17:03', '2026-06-08 10:17:03', 'Finalizada'),
(81, 40, 34, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-09 01:41:37', '2026-04-09 01:41:37', '2026-04-09 06:41:37', 'Finalizada'),
(82, 8, 32, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-13 02:03:57', NULL, NULL, 'Programada'),
(83, 50, 24, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-04 20:39:08', '2026-02-04 20:39:08', '2026-02-04 22:39:08', 'Finalizada'),
(84, 64, 37, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-11 19:41:30', NULL, NULL, 'Programada'),
(85, 95, 21, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-01-06 20:17:42', '2026-01-06 20:17:42', '2026-01-06 23:17:42', 'Finalizada'),
(86, 11, 39, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-09 03:59:18', '2026-03-09 03:59:18', '2026-03-09 09:59:18', 'Finalizada'),
(87, 2, 27, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-02 15:59:23', '2026-02-02 15:59:23', '2026-02-02 19:59:23', 'Finalizada'),
(88, 54, 38, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-01-28 10:29:58', '2026-01-28 10:29:58', '2026-01-28 14:29:58', 'Finalizada'),
(89, 33, 25, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-13 22:16:28', '2026-06-13 22:16:28', '2026-06-14 01:16:28', 'Finalizada'),
(90, 83, 40, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-24 00:25:46', '2026-02-24 00:25:46', '2026-02-24 06:25:46', 'Finalizada'),
(91, 29, 44, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-17 07:07:30', '2026-04-17 07:07:30', '2026-04-17 12:07:30', 'Finalizada'),
(92, 68, 36, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-09 03:20:50', '2026-04-09 03:20:50', '2026-04-09 06:20:50', 'Finalizada'),
(93, 78, 24, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-22 04:58:44', '2026-06-22 04:58:44', '2026-06-22 08:58:44', 'Finalizada'),
(94, 80, 43, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-05 11:34:24', '2026-02-05 11:34:24', '2026-02-05 15:34:24', 'Finalizada'),
(95, 79, 33, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-10 09:51:50', '2026-04-10 09:51:50', '2026-04-10 15:51:50', 'Finalizada'),
(96, 22, 39, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-01-23 00:37:11', '2026-01-23 00:37:11', '2026-01-23 02:37:11', 'Finalizada'),
(97, 50, 27, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-02 09:35:19', NULL, NULL, 'Programada'),
(98, 97, 27, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-09 15:52:57', '2026-03-09 15:52:57', '2026-03-09 20:52:57', 'Finalizada'),
(99, 52, 24, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-07 00:43:49', '2026-04-07 00:43:49', '2026-04-07 04:43:49', 'Finalizada'),
(100, 28, 32, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-13 01:08:18', '2026-05-13 01:08:18', '2026-05-13 03:08:18', 'Finalizada'),
(101, 96, 31, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-12 22:08:51', '2026-03-12 22:08:51', '2026-03-13 04:08:51', 'Finalizada'),
(102, 75, 23, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-20 12:27:24', '2026-06-20 12:27:24', '2026-06-20 14:27:24', 'Finalizada'),
(103, 25, 28, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-06 12:08:02', '2026-03-06 12:08:02', '2026-03-06 15:08:02', 'Finalizada'),
(104, 77, 36, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-01 00:44:25', '2026-05-01 00:44:25', '2026-05-01 06:44:25', 'Finalizada'),
(105, 87, 39, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-06 23:02:15', NULL, NULL, 'Programada'),
(106, 91, 43, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-19 03:20:22', '2026-04-19 03:20:22', '2026-04-19 09:20:22', 'Finalizada'),
(107, 48, 21, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-27 01:35:33', '2026-03-27 01:35:33', '2026-03-27 07:35:33', 'Finalizada'),
(108, 61, 34, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-12 22:28:47', '2026-02-12 22:28:47', '2026-02-13 00:28:47', 'Finalizada'),
(109, 45, 45, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-06 03:25:53', '2026-04-06 03:25:53', '2026-04-06 06:25:53', 'Finalizada'),
(110, 91, 40, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-08 23:16:19', '2026-06-08 23:16:19', '2026-06-09 05:16:19', 'Finalizada'),
(111, 32, 28, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-18 20:11:43', '2026-06-18 20:11:43', '2026-06-19 01:11:43', 'Finalizada'),
(112, 16, 40, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-25 19:04:08', '2026-05-25 19:04:08', '2026-05-25 21:04:08', 'Finalizada'),
(113, 56, 24, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-13 23:04:45', '2026-02-13 23:04:45', '2026-02-14 01:04:45', 'Finalizada'),
(114, 15, 25, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-31 01:24:59', '2026-05-31 01:24:59', '2026-05-31 05:24:59', 'Finalizada'),
(115, 93, 39, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-20 15:05:55', '2026-02-20 15:05:55', '2026-02-20 19:05:55', 'Finalizada'),
(116, 76, 37, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-01-01 09:58:15', '2026-01-01 09:58:15', '2026-01-01 13:58:15', 'Finalizada'),
(117, 44, 42, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-11 02:14:57', '2026-06-11 02:14:57', '2026-06-11 07:14:57', 'Finalizada'),
(118, 4, 41, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-10 00:17:05', '2026-04-10 00:17:05', '2026-04-10 05:17:05', 'Finalizada'),
(119, 11, 25, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-06 10:55:20', '2026-06-06 10:55:20', '2026-06-06 15:55:20', 'Finalizada'),
(120, 77, 24, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-09 04:04:55', '2026-06-09 04:04:55', '2026-06-09 07:04:55', 'Finalizada'),
(121, 83, 33, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-01-17 06:14:53', '2026-01-17 06:14:53', '2026-01-17 12:14:53', 'Finalizada'),
(122, 19, 44, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-18 17:13:56', '2026-03-18 17:13:56', '2026-03-18 21:13:56', 'Finalizada'),
(123, 27, 30, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-15 03:48:47', '2026-05-15 03:48:47', '2026-05-15 07:48:47', 'Finalizada'),
(124, 23, 35, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-08 04:24:28', '2026-03-08 04:24:28', '2026-03-08 08:24:28', 'Finalizada'),
(125, 55, 41, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-01-19 17:50:50', '2026-01-19 17:50:50', '2026-01-19 21:50:50', 'Finalizada'),
(126, 16, 31, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-15 15:58:02', '2026-03-15 15:58:02', '2026-03-15 20:58:02', 'Finalizada'),
(127, 70, 35, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-04 10:55:20', '2026-02-04 10:55:20', '2026-02-04 12:55:20', 'Finalizada'),
(128, 58, 41, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-19 07:10:25', '2026-06-19 07:10:25', '2026-06-19 10:10:25', 'Finalizada'),
(129, 52, 27, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-26 06:26:16', '2026-02-26 06:26:16', '2026-02-26 08:26:16', 'Finalizada'),
(130, 50, 30, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-04-05 18:50:10', '2026-04-05 18:50:10', '2026-04-06 00:50:10', 'Finalizada'),
(131, 50, 37, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-02 00:53:06', NULL, NULL, 'Programada'),
(132, 56, 38, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-01 09:03:40', '2026-05-01 09:03:40', '2026-05-01 11:03:40', 'Finalizada'),
(133, 34, 30, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-07 00:26:33', '2026-02-07 00:26:33', '2026-02-07 06:26:33', 'Finalizada'),
(134, 57, 40, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-11 00:16:13', '2026-06-11 00:16:13', '2026-06-11 04:16:13', 'Finalizada'),
(135, 18, 43, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-06-19 01:00:34', '2026-06-19 01:00:34', '2026-06-19 07:00:34', 'Finalizada'),
(136, 63, 45, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-05-10 10:54:06', '2026-05-10 10:54:06', '2026-05-10 16:54:06', 'Finalizada'),
(137, 25, 24, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-07-03 23:28:53', NULL, NULL, 'Programada'),
(138, 40, 45, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-28 00:18:29', '2026-03-28 00:18:29', '2026-03-28 02:18:29', 'Finalizada'),
(139, 92, 28, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-02-12 11:58:31', '2026-02-12 11:58:31', '2026-02-12 16:58:31', 'Finalizada'),
(140, 54, 45, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-09 19:08:51', '2026-03-09 19:08:51', '2026-03-10 01:08:51', 'Finalizada'),
(141, 44, 25, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-29 18:10:54', '2026-03-29 18:10:54', '2026-03-29 22:10:54', 'Finalizada'),
(142, 38, 40, 'Mantenimiento Preventivo', 'Mantenimiento Preventivo — datos de prueba', '2026-03-28 13:21:10', '2026-03-28 13:21:10', '2026-03-28 16:21:10', 'Finalizada'),
(143, 93, 28, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-04-13 06:09:16', '2026-04-13 06:09:16', '2026-04-13 10:09:16', 'Finalizada'),
(144, 78, 45, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-03-07 00:17:28', '2026-03-07 00:17:28', '2026-03-07 05:17:28', 'Finalizada'),
(145, 8, 45, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-03-28 13:04:53', '2026-03-28 13:04:53', '2026-03-28 19:04:53', 'Finalizada'),
(146, 27, 37, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-03-22 09:50:25', '2026-03-22 09:50:25', '2026-03-22 14:50:25', 'Finalizada'),
(147, 58, 31, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-04-01 02:32:26', '2026-04-01 02:32:26', '2026-04-01 05:32:26', 'Finalizada'),
(148, 91, 24, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-28 21:54:09', '2026-06-28 21:54:09', NULL, 'En Curso'),
(149, 68, 38, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-21 22:35:42', NULL, NULL, 'Programada'),
(150, 28, 22, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-02-16 05:27:15', '2026-02-16 05:27:15', '2026-02-16 11:27:15', 'Finalizada'),
(151, 15, 33, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-20 13:39:10', NULL, NULL, 'Programada'),
(152, 76, 35, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-17 16:39:05', NULL, NULL, 'Programada'),
(153, 21, 24, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-20 21:07:13', '2026-06-20 21:07:13', '2026-06-21 03:07:13', 'Finalizada'),
(154, 91, 40, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-09 10:55:06', '2026-06-09 10:55:06', '2026-06-09 14:55:06', 'Finalizada'),
(155, 81, 38, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-04-02 01:48:56', '2026-04-02 01:48:56', '2026-04-02 06:48:56', 'Finalizada'),
(156, 55, 25, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-01-18 07:21:07', '2026-01-18 07:21:07', '2026-01-18 13:21:07', 'Finalizada'),
(157, 89, 22, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-21 08:10:06', '2026-06-21 08:10:06', '2026-06-21 11:10:06', 'Finalizada'),
(158, 14, 22, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-28 16:42:27', '2026-06-28 16:42:27', NULL, 'En Curso'),
(159, 71, 42, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-04-24 09:23:04', '2026-04-24 09:23:04', '2026-04-24 12:23:04', 'Finalizada'),
(160, 50, 42, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-01-20 03:00:13', '2026-01-20 03:00:13', '2026-01-20 07:00:13', 'Finalizada'),
(161, 9, 24, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-01-28 19:41:20', '2026-01-28 19:41:20', '2026-01-28 23:41:20', 'Finalizada'),
(162, 87, 21, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-07 01:03:25', NULL, NULL, 'Programada'),
(163, 63, 30, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-04-14 04:53:15', '2026-04-14 04:53:15', '2026-04-14 08:53:15', 'Finalizada'),
(164, 73, 42, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-27 00:20:50', '2026-06-27 00:20:50', NULL, 'En Curso'),
(165, 94, 29, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-25 18:45:02', '2026-06-25 18:45:02', NULL, 'En Curso'),
(166, 35, 39, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-22 08:34:46', '2026-06-22 08:34:46', '2026-06-22 13:34:46', 'Finalizada'),
(167, 48, 25, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-04-03 18:58:38', '2026-04-03 18:58:38', '2026-04-04 00:58:38', 'Finalizada'),
(168, 62, 45, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-21 01:20:33', '2026-05-21 01:20:33', '2026-05-21 03:20:33', 'Finalizada'),
(169, 52, 27, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-04-06 01:14:00', '2026-04-06 01:14:00', '2026-04-06 04:14:00', 'Finalizada'),
(170, 27, 39, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-16 19:53:40', '2026-05-16 19:53:40', '2026-05-17 01:53:40', 'Finalizada'),
(171, 78, 23, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-04-22 13:58:05', '2026-04-22 13:58:05', '2026-04-22 19:58:05', 'Finalizada'),
(172, 100, 23, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-29 02:23:38', '2026-05-29 02:23:38', '2026-05-29 04:23:38', 'Finalizada'),
(173, 25, 28, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-09 04:21:28', '2026-05-09 04:21:28', '2026-05-09 10:21:28', 'Finalizada'),
(174, 54, 37, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-27 16:52:42', '2026-05-27 16:52:42', '2026-05-27 18:52:42', 'Finalizada'),
(175, 81, 24, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-06 07:18:32', NULL, NULL, 'Programada'),
(176, 49, 29, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-03-24 06:05:07', '2026-03-24 06:05:07', '2026-03-24 08:05:07', 'Finalizada'),
(177, 62, 30, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-27 14:55:02', '2026-06-27 14:55:02', NULL, 'En Curso'),
(178, 49, 25, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-01-08 01:34:43', '2026-01-08 01:34:43', '2026-01-08 05:34:43', 'Finalizada'),
(179, 66, 34, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-05 13:11:33', NULL, NULL, 'Programada'),
(180, 14, 42, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-27 19:19:08', '2026-05-27 19:19:08', '2026-05-27 23:19:08', 'Finalizada'),
(181, 93, 34, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-01-26 01:05:07', '2026-01-26 01:05:07', '2026-01-26 04:05:07', 'Finalizada'),
(182, 45, 38, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-09 04:03:33', NULL, NULL, 'Programada'),
(183, 55, 42, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-09 06:51:47', '2026-05-09 06:51:47', '2026-05-09 09:51:47', 'Finalizada'),
(184, 24, 23, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-03-21 04:00:47', '2026-03-21 04:00:47', '2026-03-21 06:00:47', 'Finalizada'),
(185, 13, 27, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-01 21:42:58', NULL, NULL, 'Programada'),
(186, 82, 39, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-01-05 00:02:20', '2026-01-05 00:02:20', '2026-01-05 03:02:20', 'Finalizada'),
(187, 60, 34, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-02-15 00:54:41', '2026-02-15 00:54:41', '2026-02-15 05:54:41', 'Finalizada'),
(188, 73, 24, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-02-07 11:36:47', '2026-02-07 11:36:47', '2026-02-07 13:36:47', 'Finalizada'),
(189, 69, 31, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-05 10:28:43', '2026-06-05 10:28:43', '2026-06-05 13:28:43', 'Finalizada'),
(190, 54, 26, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-16 02:15:48', '2026-06-16 02:15:48', '2026-06-16 05:15:48', 'Finalizada'),
(191, 7, 34, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-04-11 23:27:31', '2026-04-11 23:27:31', '2026-04-12 04:27:31', 'Finalizada'),
(192, 77, 23, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-29 22:39:18', '2026-06-29 22:39:18', NULL, 'En Curso'),
(193, 11, 37, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-02-10 21:57:36', '2026-02-10 21:57:36', '2026-02-11 03:57:36', 'Finalizada'),
(194, 39, 38, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-21 22:16:06', NULL, NULL, 'Programada'),
(195, 21, 39, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-02-25 16:05:33', '2026-02-25 16:05:33', '2026-02-25 19:05:33', 'Finalizada'),
(196, 9, 38, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-16 20:50:36', '2026-05-16 20:50:36', '2026-05-16 23:50:36', 'Finalizada'),
(197, 57, 43, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-30 19:08:04', '2026-06-30 19:08:04', NULL, 'En Curso'),
(198, 37, 21, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-11 09:17:04', NULL, NULL, 'Programada'),
(199, 40, 27, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-01-21 01:10:36', '2026-01-21 01:10:36', '2026-01-21 03:10:36', 'Finalizada'),
(200, 29, 39, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-26 11:43:58', '2026-06-26 11:43:58', NULL, 'En Curso'),
(201, 11, 35, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-01-08 21:57:12', '2026-01-08 21:57:12', '2026-01-09 03:57:12', 'Finalizada'),
(202, 44, 25, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-01-23 19:41:47', '2026-01-23 19:41:47', '2026-01-23 21:41:47', 'Finalizada'),
(203, 54, 44, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-03-13 09:30:12', '2026-03-13 09:30:12', '2026-03-13 15:30:12', 'Finalizada'),
(204, 73, 42, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-13 03:03:58', '2026-05-13 03:03:58', '2026-05-13 09:03:58', 'Finalizada'),
(205, 60, 35, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-02-28 13:55:42', '2026-02-28 13:55:42', '2026-02-28 16:55:42', 'Finalizada'),
(206, 38, 22, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-06 11:59:52', '2026-06-06 11:59:52', '2026-06-06 15:59:52', 'Finalizada'),
(207, 66, 33, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-07 11:35:30', '2026-05-07 11:35:30', '2026-05-07 15:35:30', 'Finalizada'),
(208, 73, 42, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-02-20 15:06:07', '2026-02-20 15:06:07', '2026-02-20 19:06:07', 'Finalizada'),
(209, 11, 39, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-09 14:06:41', '2026-05-09 14:06:41', '2026-05-09 20:06:41', 'Finalizada'),
(210, 12, 31, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-14 14:19:31', NULL, NULL, 'Programada'),
(211, 1, 43, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-28 06:23:51', '2026-06-28 06:23:51', NULL, 'En Curso'),
(212, 34, 27, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-04-16 08:11:13', '2026-04-16 08:11:13', '2026-04-16 14:11:13', 'Finalizada'),
(213, 50, 26, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-01-23 20:13:32', '2026-01-23 20:13:32', '2026-01-23 23:13:32', 'Finalizada'),
(214, 53, 33, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-02-27 02:52:04', '2026-02-27 02:52:04', '2026-02-27 04:52:04', 'Finalizada'),
(215, 42, 34, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-19 14:51:06', '2026-06-19 14:51:06', '2026-06-19 20:51:06', 'Finalizada'),
(216, 48, 37, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-02-08 12:42:53', '2026-02-08 12:42:53', '2026-02-08 16:42:53', 'Finalizada'),
(217, 9, 27, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-01-27 12:45:53', '2026-01-27 12:45:53', '2026-01-27 18:45:53', 'Finalizada'),
(218, 63, 38, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-05-27 21:08:11', '2026-05-27 21:08:11', '2026-05-28 01:08:11', 'Finalizada'),
(219, 24, 32, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-16 07:51:42', '2026-06-16 07:51:42', '2026-06-16 11:51:42', 'Finalizada'),
(220, 37, 27, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-27 03:47:12', '2026-06-27 03:47:12', NULL, 'En Curso'),
(221, 85, 32, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-06-25 00:11:40', '2026-06-25 00:11:40', NULL, 'En Curso'),
(222, 29, 43, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-20 03:20:55', NULL, NULL, 'Programada'),
(223, 1, 24, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-02-03 00:38:58', '2026-02-03 00:38:58', '2026-02-03 03:38:58', 'Finalizada'),
(224, 43, 31, 'Reparación / Mantenimiento Correctivo', 'Reparación / Mantenimiento Correctivo — datos de prueba', '2026-07-02 18:44:15', NULL, NULL, 'Programada'),
(225, 80, 25, 'Desinstalación', 'Retiro de equipo por baja de contrato — datos de prueba', '2025-10-20 00:55:00', '2025-10-20 00:55:00', '2025-10-20 03:55:00', 'Finalizada'),
(226, 35, 41, 'Desinstalación', 'Retiro de equipo por baja de contrato — datos de prueba', '2025-11-07 10:14:27', '2025-11-07 10:14:27', '2025-11-07 12:14:27', 'Finalizada'),
(227, 62, 34, 'Desinstalación', 'Retiro de equipo por baja de contrato — datos de prueba', '2025-08-29 12:36:43', '2025-08-29 12:36:43', '2025-08-29 15:36:43', 'Finalizada'),
(228, 41, 38, 'Desinstalación', 'Retiro de equipo por baja de contrato — datos de prueba', '2025-10-19 13:40:11', '2025-10-19 13:40:11', '2025-10-19 18:40:11', 'Finalizada'),
(229, 36, 22, 'Desinstalación', 'Retiro de equipo por baja de contrato — datos de prueba', '2026-02-24 18:48:11', '2026-02-24 18:48:11', '2026-02-24 23:48:11', 'Finalizada'),
(230, 82, 30, 'Desinstalación', 'Retiro de equipo por baja de contrato — datos de prueba', '2026-01-27 14:41:12', '2026-01-27 14:41:12', '2026-01-27 17:41:12', 'Finalizada'),
(231, 65, 23, 'Desinstalación', 'Retiro de equipo por baja de contrato — datos de prueba', '2025-11-29 22:56:29', '2025-11-29 22:56:29', '2025-11-30 01:56:29', 'Finalizada'),
(232, 22, 38, 'Desinstalación', 'Retiro de equipo por baja de contrato — datos de prueba', '2025-06-20 12:09:15', '2025-06-20 12:09:15', '2025-06-20 16:09:15', 'Finalizada');

-- --------------------------------------------------------

--
-- Table structure for table `CODIGOS_EVENTOS`
--

CREATE TABLE `CODIGOS_EVENTOS` (
  `ID_CodigoEvento` int NOT NULL,
  `Codigo` varchar(50) NOT NULL,
  `DescripcionAlarma` varchar(255) NOT NULL,
  `Prioridad` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `CODIGOS_EVENTOS`
--

INSERT INTO `CODIGOS_EVENTOS` (`ID_CodigoEvento`, `Codigo`, `DescripcionAlarma`, `Prioridad`) VALUES
(1, 'BAT-LOW', 'Batería Baja: Nivel inferior al 20%', 'Baja'),
(2, 'CONN-LOST', 'Pérdida de Conexión: Dispositivo offline', 'Crítico'),
(3, 'TAMPER', 'Manipulación Detectada: Apertura de chasis', 'Alta'),
(4, 'BURG-Z02', 'Disparo de Alarma: Zona 02 Intrusión / Perimetral', 'Crítico'),
(5, 'AC-LOST', 'Falla de Energía: Corte de red eléctrica 220V', 'Baja'),
(6, 'SIR-FAIL', 'Falla de Sirena: Cortocircuito o cable cortado', 'Alta'),
(7, 'ZONE-OPEN', 'Falla de Zona: Detector abierto o descalibrado', 'Alta'),
(8, 'FIRE-ALM', 'Alarma de Incendio: Sensor de humo / calor activado', 'Crítico'),
(9, 'PANIC-BUT', 'Pánico Activado: Pulsador manual de emergencia', 'Crítico'),
(10, 'BAT-MTRX', 'Batería Ausente: Desconexión física en placa principal', 'Alta'),
(11, 'COMM-FAIL', 'Falla de Comunicación: Línea telefónica/GPRS cortada', 'Crítico'),
(12, 'TAMPER-RF', 'Sabotaje Inalámbrico: Apertura de sensor magnético/PIR', 'Alta'),
(13, 'KEY-FAIL', 'Falla de Teclado: Pérdida de supervisión del bus de datos', 'Crítico'),
(14, 'RF-JAMM', 'Interferencia RF: Bloqueo de señal inalámbrica detectado', 'Crítico'),
(15, 'MED-ALRM', 'Emergencia Médica: Solicitud de asistencia técnica médica', 'Alta'),
(16, 'TEST-FAIL', 'Falla de Test Auto: Falta de reporte periódico del panel', 'Alta'),
(17, 'PUMP-FAIL', 'Falla de Presión: Sensor de bomba de agua/incendio inactivo', 'Alta'),
(18, 'LINK-DOWN', 'Caída de Enlace IP: Módulo Ethernet sin IP o sin Gateway', 'Crítico'),
(19, 'BATT-WL', 'Batería Baja Inalámbrica: Sensor periférico sin energía', 'Baja'),
(20, 'AUX-OVER', 'Sobrecarga Auxiliar: Salida de 12V superada en consumo', 'Alta');

-- --------------------------------------------------------

--
-- Table structure for table `COTIZACIONES`
--

CREATE TABLE `COTIZACIONES` (
  `ID_Cotizacion` int NOT NULL,
  `ID_Abonado` int DEFAULT NULL,
  `ID_Vendedor` int NOT NULL,
  `FechaCotizacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `MontoTotal` decimal(12,2) NOT NULL,
  `Estado` varchar(30) NOT NULL DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `COTIZACIONES`
--

INSERT INTO `COTIZACIONES` (`ID_Cotizacion`, `ID_Abonado`, `ID_Vendedor`, `FechaCotizacion`, `MontoTotal`, `Estado`) VALUES
(1, 383, 76, '2026-05-15 01:18:58', 212000.00, 'Rechazada'),
(2, 329, 76, '2026-04-30 15:17:34', 151000.00, 'Rechazada'),
(3, 382, 76, '2026-01-08 16:38:46', 98000.00, 'Rechazada'),
(4, 334, 77, '2026-04-02 03:04:03', 132000.00, 'Pendiente'),
(5, 334, 76, '2026-04-01 09:06:25', 135000.00, 'Rechazada'),
(6, 329, 77, '2026-03-18 12:06:32', 112000.00, 'Aprobada'),
(7, 28, 76, '2026-03-31 06:40:37', 141000.00, 'Rechazada'),
(8, 357, 77, '2026-01-25 15:30:17', 172000.00, 'Pendiente'),
(9, 385, 77, '2026-05-24 01:22:19', 124000.00, 'Pendiente'),
(10, 382, 76, '2026-02-18 18:29:29', 139000.00, 'Pendiente'),
(11, 385, 77, '2026-06-14 08:26:25', 167000.00, 'Rechazada'),
(12, 313, 77, '2026-02-15 16:51:27', 130000.00, 'Pendiente'),
(13, 15, 76, '2026-04-16 21:00:04', 91000.00, 'Aprobada'),
(14, 352, 76, '2026-04-10 07:32:42', 182000.00, 'Aprobada'),
(15, 361, 76, '2026-02-27 06:06:24', 129000.00, 'Rechazada'),
(16, 14, 76, '2026-02-24 23:46:11', 246000.00, 'Pendiente'),
(17, 359, 77, '2026-01-19 09:27:18', 226000.00, 'Aprobada'),
(18, 373, 76, '2026-04-19 22:09:36', 171000.00, 'Pendiente'),
(19, NULL, 76, '2026-02-14 00:33:07', 98000.00, 'Aprobada'),
(20, NULL, 77, '2026-03-13 19:48:02', 175000.00, 'Aprobada');

-- --------------------------------------------------------

--
-- Table structure for table `DIRECCIONES`
--

CREATE TABLE `DIRECCIONES` (
  `ID_Direccion` int NOT NULL,
  `ID_Abonado` int NOT NULL,
  `Calle` varchar(100) NOT NULL,
  `Numero` varchar(20) DEFAULT NULL,
  `Ciudad` varchar(50) NOT NULL,
  `CoordenadasGPS` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `DIRECCIONES`
--

INSERT INTO `DIRECCIONES` (`ID_Direccion`, `ID_Abonado`, `Calle`, `Numero`, `Ciudad`, `CoordenadasGPS`) VALUES
(1, 2, 'Av. Corrientes', '1234', 'Buenos Aires', '-34.6037,-58.3816'),
(2, 3, 'Av. Santa Fe', '5678', 'Buenos Aires', '-34.5950,-58.3930'),
(3, 4, 'Av. Rivadavia', '9012', 'Buenos Aires', '-34.6083,-58.3712'),
(4, 7, 'Av. Cabildo', '3456', 'Buenos Aires', '-34.5630,-58.4580'),
(5, 9, 'Florida', '789', 'Buenos Aires', '-34.6014,-58.3731'),
(6, 6, 'Sarmiento', '3045', 'Vicente López', '-34.5413,-58.4880075'),
(7, 8, 'Av. Corrientes', '498', 'Rosario', '-29.1233522,-59.2516468'),
(8, 10, 'Av. Corrientes', '1945', 'Córdoba', '-31.1385173,-64.2746821'),
(9, 11, 'Rivadavia', '5965', 'Mar del Plata', '-37.9830559,-57.5812934'),
(10, 12, 'Av. Libertador', '9240', 'San Isidro', '-34.464415,-58.5156171'),
(11, 13, 'Av. Santa Fe', '9391', 'San Isidro', '-34.479402,-58.5078283'),
(12, 14, 'Av. Santa Fe', '7214', 'Rosario', '-32.8647259,-60.7870915'),
(13, 15, 'San Martín', '772', 'La Plata', '-34.9206129,-57.932231'),
(14, 16, 'Belgrano', '102', 'La Plata', '-34.899528,-57.963249'),
(15, 17, 'Av. Corrientes', '1640', 'Córdoba', '-31.1385173,-64.2746821'),
(16, 18, '9 de Julio', '4255', 'Rosario', '-32.9461835,-60.6830942'),
(17, 19, 'Alem', '7777', 'Rosario', '-32.9722754,-60.634333'),
(18, 20, '9 de Julio', '1044', 'Buenos Aires', '-34.6044364,-58.3802711'),
(19, 21, 'Sarmiento', '1512', 'La Plata', '-34.9364322,-57.9471183'),
(20, 22, 'Sarmiento', '9011', 'La Plata', '-34.9376315,-57.9465383'),
(21, 23, 'Av. Santa Fe', '1874', 'Córdoba', '-32.6879435,-62.1157153'),
(22, 24, 'Alem', '7907', 'La Plata', '-34.9518577,-57.9507396'),
(23, 25, 'Sarmiento', '8612', 'Mar del Plata', '-37.9797535,-57.5756232'),
(24, 26, 'San Martín', '5914', 'Buenos Aires', '-34.6893006,-58.5102408'),
(25, 27, 'Av. Libertador', '995', 'Mar del Plata', NULL),
(26, 28, 'Belgrano', '4590', 'San Isidro', '-34.4714622,-58.5142059'),
(27, 29, 'Av. Corrientes', '5118', 'San Isidro', '-31.8223313,-64.3919736'),
(28, 30, 'Av. Corrientes', '9723', 'Quilmes', '-34.7481148,-58.3066278'),
(29, 312, 'Av. Corrientes', '264', 'La Plata', '-34.9217719,-57.9633885'),
(30, 313, '9 de Julio', '7851', 'Córdoba', '-31.3411658,-64.3406922'),
(31, 314, 'Av. Santa Fe', '5488', 'Rosario', '-32.8647259,-60.7870915'),
(32, 315, 'Sarmiento', '1013', 'Buenos Aires', '-34.6052226,-58.3857649'),
(33, 316, 'Rivadavia', '7582', 'Quilmes', '-34.7194285,-58.2521395'),
(34, 317, 'San Martín', '7676', 'Mar del Plata', '-37.9759959,-57.5933069'),
(35, 318, '9 de Julio', '5318', 'Mar del Plata', '-37.9831247,-57.572439'),
(36, 319, 'Mitre', '820', 'La Plata', '-34.9250582,-57.9459734'),
(37, 320, 'Av. Libertador', '5480', 'La Plata', NULL),
(38, 321, 'Av. Santa Fe', '6564', 'Vicente López', '-33.0089872,-60.6501088'),
(39, 322, 'Alem', '8071', 'San Isidro', '-34.4733552,-58.5134147'),
(40, 323, 'Av. Santa Fe', '2373', 'Quilmes', '-34.7384115,-58.2270325'),
(41, 324, 'Belgrano', '383', 'Rosario', '-32.9033991,-60.9066909'),
(42, 325, 'Av. Santa Fe', '9675', 'Mar del Plata', '-38.0242664,-57.564176'),
(43, 326, 'Av. Libertador', '3588', 'San Isidro', '-34.464415,-58.5156171'),
(44, 327, 'Av. Corrientes', '4436', 'Mar del Plata', '-38.016555,-57.5565019'),
(45, 328, 'Rivadavia', '3494', 'Rosario', '-32.7713221,-60.7369515'),
(46, 329, 'Av. Libertador', '2530', 'Quilmes', NULL),
(47, 330, 'San Martín', '8234', 'Córdoba', '-33.0995068,-64.3472634'),
(48, 331, 'Av. Santa Fe', '649', 'Mar del Plata', '-38.0064499,-57.5497334'),
(49, 332, 'Av. Libertador', '237', 'Vicente López', '-34.5321689,-58.4680439'),
(50, 333, 'Alem', '4973', 'Buenos Aires', '-38.0376001,-57.544093'),
(51, 334, '9 de Julio', '4902', 'La Plata', '-34.9129224,-57.9442605'),
(52, 335, 'Rivadavia', '9439', 'La Plata', '-34.8887007,-57.9553421'),
(53, 336, '9 de Julio', '9914', 'Rosario', '-32.953989,-60.6393914'),
(54, 337, 'Av. Libertador', '3737', 'Córdoba', '-31.2504212,-63.0633183'),
(55, 338, 'Belgrano', '1761', 'Mar del Plata', '-38.0025601,-57.5451585'),
(56, 339, 'Av. Corrientes', '9310', 'Córdoba', '-31.1385173,-64.2746821'),
(57, 340, 'San Martín', '4993', 'Rosario', '-32.8514003,-60.763508'),
(58, 341, 'Alem', '171', 'La Plata', '-34.951114,-57.9489697'),
(59, 342, 'Alem', '5520', 'Vicente López', '-34.5222282,-58.5254394'),
(60, 343, '9 de Julio', '3708', 'San Isidro', '-34.4684831,-58.5106849'),
(61, 344, 'Av. Libertador', '1072', 'Vicente López', '-34.5242689,-58.4726794'),
(62, 345, 'Sarmiento', '4774', 'Mar del Plata', '-38.0290547,-57.5566282'),
(63, 346, 'Belgrano', '2655', 'Quilmes', '-34.7196381,-58.2500336'),
(64, 347, 'Mitre', '9808', 'Córdoba', '-33.1250069,-64.3531248'),
(65, 348, 'Av. Libertador', '1230', 'Rosario', '-33.0328175,-60.6262072'),
(66, 349, 'Rivadavia', '9259', 'La Plata', '-34.8887007,-57.9553421'),
(67, 350, 'Av. Santa Fe', '2365', 'Quilmes', '-34.7384115,-58.2270325'),
(68, 351, 'Av. Corrientes', '9818', 'Buenos Aires', '-34.6044352,-58.3945909'),
(69, 352, 'Av. Santa Fe', '9573', 'La Plata', '-34.9188539,-57.9568194'),
(70, 353, 'Sarmiento', '8847', 'Quilmes', '-34.7379171,-58.238629'),
(71, 354, 'Mitre', '7292', 'Vicente López', '-34.5135486,-58.5308764'),
(72, 355, 'Mitre', '5302', 'Córdoba', '-31.3432216,-64.2896611'),
(73, 356, 'Av. Corrientes', '9754', 'Córdoba', '-31.1385173,-64.2746821'),
(74, 357, 'Av. Corrientes', '5874', 'Córdoba', '-31.1385173,-64.2746821'),
(75, 358, 'Alem', '8378', 'La Plata', '-34.951114,-57.9489697'),
(76, 359, 'Alem', '8306', 'Rosario', '-32.976849,-60.6354989'),
(77, 360, '9 de Julio', '5561', 'Buenos Aires', '-36.8784961,-60.2946253'),
(78, 361, 'Av. Libertador', '9309', 'Vicente López', '-34.5320502,-58.4682229'),
(79, 362, 'Belgrano', '9872', 'Buenos Aires', '-34.5613076,-58.4565454'),
(80, 363, 'San Martín', '1788', 'La Plata', '-34.9153007,-57.9478666'),
(81, 364, 'Rivadavia', '7524', 'Vicente López', '-34.5290841,-58.5211167'),
(82, 365, 'Mitre', '5810', 'San Isidro', '-34.4611203,-58.5070285'),
(83, 366, 'Av. Santa Fe', '4271', 'Vicente López', '-33.0161818,-60.6456274'),
(84, 367, 'Rivadavia', '1712', 'Mar del Plata', '-38.0000165,-57.5480582'),
(85, 368, 'Av. Libertador', '2623', 'Buenos Aires', '-34.5783264,-58.4069812'),
(86, 369, '9 de Julio', '4670', 'Buenos Aires', '-36.8847214,-60.3024493'),
(87, 370, 'Alem', '7227', 'Vicente López', '-34.5256336,-58.5221791'),
(88, 371, 'Av. Libertador', '3830', 'Buenos Aires', '-34.5718957,-58.4223155'),
(89, 372, 'Mitre', '662', 'San Isidro', '-34.4593032,-58.5065406'),
(90, 373, 'Sarmiento', '6385', 'Vicente López', '-34.5413,-58.4880075'),
(91, 374, 'Av. Libertador', '3343', 'Rosario', '-33.0326419,-60.6188932'),
(92, 375, 'Mitre', '3471', 'Quilmes', '-34.7178207,-58.2565787'),
(93, 376, 'Belgrano', '9269', 'Mar del Plata', '-37.9936512,-57.5627673'),
(94, 377, 'Rivadavia', '3694', 'San Isidro', '-34.4658654,-58.5198072'),
(95, 378, 'Belgrano', '370', 'Buenos Aires', '-34.7151271,-58.2532488'),
(96, 379, '9 de Julio', '2878', 'Córdoba', '-31.4037357,-64.2195159'),
(97, 380, '9 de Julio', '2893', 'La Plata', '-34.9129224,-57.9442605'),
(98, 382, 'Sarmiento', '3370', 'Quilmes', '-34.7379171,-58.238629'),
(99, 383, 'Sarmiento', '8618', 'Quilmes', '-34.7253833,-58.249708'),
(100, 384, 'San Martín', '4579', 'Mar del Plata', '-37.9893382,-57.5666718'),
(101, 385, 'San Martín', '555', 'Buenos Aires', '-34.6014873,-58.3739016'),
(103, 387, 'Av. Pedro Goyena ', '324', 'Buenos Aires', '-34.6257158,-58.4317377'),
(104, 388, 'Av Avellaneda ', '1506', 'Buenos Aires', '-34.6200526,-58.4526446');

-- --------------------------------------------------------

--
-- Table structure for table `DISPOSITIVOS`
--

CREATE TABLE `DISPOSITIVOS` (
  `ID_Dispositivo` int NOT NULL,
  `ID_Direccion` int NOT NULL,
  `ID_Modelo` int NOT NULL,
  `NumeroSerie` varchar(100) NOT NULL,
  `NombreDispositivo` varchar(150) NOT NULL,
  `Zona_Ubicacion` varchar(50) DEFAULT NULL,
  `FechaInstalacion` date NOT NULL,
  `Estado` varchar(20) NOT NULL DEFAULT 'Operativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `DISPOSITIVOS`
--

INSERT INTO `DISPOSITIVOS` (`ID_Dispositivo`, `ID_Direccion`, `ID_Modelo`, `NumeroSerie`, `NombreDispositivo`, `Zona_Ubicacion`, `FechaInstalacion`, `Estado`) VALUES
(1, 1, 1, 'DSC-NEO-001', 'Panel Principal Rodríguez', 'Zona Central', '2025-01-15', 'Operativo'),
(2, 1, 2, 'HIK-DOMO-001', 'Cámara Entrada Rodríguez', 'Entrada Principal', '2025-01-15', 'Operativo'),
(3, 2, 1, 'DSC-NEO-002', 'Panel Estancia Blanqueada', 'Zona Norte', '2025-01-20', 'Operativo'),
(4, 3, 3, 'ZKT-HUE-001', 'Lector Biométrico Schmidt', 'Acceso Oficinas', '2025-01-25', 'Operativo'),
(5, 4, 2, 'HIK-DOMO-002', 'Cámara Supermercado Wong', 'Caja Principal', '2025-02-01', 'Operativo'),
(6, 5, 1, 'DSC-NEO-003', 'Panel Consorcio Florida', 'Hall Central', '2025-02-05', 'Operativo'),
(7, 80, 1, 'SEED-DISP-0001-G3WW19', 'Panel Principal Peugeot', 'Entrada Principal', '2025-04-25', 'Operativo'),
(8, 91, 1, 'SEED-DISP-0002-W5YFBM', 'Panel Principal DirectTV', 'Entrada Principal', '2025-05-12', 'Operativo'),
(9, 35, 1, 'SEED-DISP-0003-RGSQB3', 'Panel Principal Insumos', 'Entrada Principal', '2025-03-19', 'Operativo'),
(10, 31, 1, 'SEED-DISP-0004-XTWTPR', 'Panel Principal Carniceria', 'Entrada Principal', '2025-03-08', 'Operativo'),
(11, 31, 2, 'SEED-DISP-0005-QI3YE1', 'Cámara Acceso Vehicular Carniceria', 'Acceso Vehicular', '2025-03-13', 'Operativo'),
(12, 56, 1, 'SEED-DISP-0006-ZYNOBB', 'Panel Principal Garage', 'Entrada Principal', '2025-04-06', 'Operativo'),
(13, 56, 2, 'SEED-DISP-0007-RE627M', 'Cámara Perímetro Garage', 'Depósito', '2025-04-14', 'Operativo'),
(14, 56, 3, 'SEED-DISP-0008-PT1J2C', 'Lector Biométrico Garage', 'Acceso Peatonal', '2025-04-11', 'Operativo'),
(15, 37, 1, 'SEED-DISP-0009-YGHXAM', 'Panel Principal Pinturerias', 'Entrada Principal', '2025-03-14', 'Operativo'),
(16, 37, 2, 'SEED-DISP-0010-WQI6KG', 'Cámara Entrada Pinturerias', 'Depósito', '2025-03-18', 'Operativo'),
(17, 89, 1, 'SEED-DISP-0011-IEL7LE', 'Panel Principal Movistar', 'Entrada Principal', '2025-05-14', 'Operativo'),
(18, 79, 1, 'SEED-DISP-0012-T4VX9M', 'Panel Principal Fiat', 'Entrada Principal', '2025-05-04', 'Operativo'),
(19, 61, 1, 'SEED-DISP-0013-KQRXDQ', 'Panel Principal Club', 'Entrada Principal', '2025-04-07', 'Operativo'),
(20, 12, 1, 'SEED-DISP-0014-0YZL8O', 'Panel Principal Ferretería', 'Entrada Principal', '2025-02-15', 'Operativo'),
(21, 47, 1, 'SEED-DISP-0015-RYBH18', 'Panel Principal Agencia', 'Entrada Principal', '2025-04-01', 'Operativo'),
(22, 47, 3, 'SEED-DISP-0016-ZDIMC7', 'Lector Biométrico Agencia', 'Acceso Peatonal', '2025-04-04', 'Operativo'),
(23, 96, 1, 'SEED-DISP-0017-4CH0AL', 'Panel Principal AySA', 'Entrada Principal', '2025-05-15', 'Operativo'),
(24, 59, 1, 'SEED-DISP-0018-Q8HY7S', 'Panel Principal Bodegas', 'Entrada Principal', '2025-04-11', 'Operativo'),
(25, 94, 1, 'SEED-DISP-0019-J6J2VR', 'Panel Principal Edesur', 'Entrada Principal', '2025-05-21', 'Operativo'),
(26, 94, 2, 'SEED-DISP-0020-ZJ4US2', 'Cámara Depósito Edesur', 'Entrada', '2025-05-22', 'Operativo'),
(27, 25, 1, 'SEED-DISP-0021-GD2FQ6', 'Panel Principal Pizzería', 'Entrada Principal', '2025-03-05', 'Operativo'),
(28, 25, 2, 'SEED-DISP-0022-04N6YK', 'Cámara Perímetro Pizzería', 'Acceso Vehicular', '2025-03-10', 'Operativo'),
(29, 25, 3, 'SEED-DISP-0023-SEO5H5', 'Lector Biométrico Pizzería', 'Acceso Peatonal', '2025-03-13', 'Operativo'),
(30, 2, 2, 'SEED-DISP-0024-I6E2E8', 'Cámara Perímetro Estancia', 'Entrada', '2025-02-01', 'Operativo'),
(31, 92, 1, 'SEED-DISP-0025-5BG4Y0', 'Panel Principal Cablevision', 'Entrada Principal', '2025-05-16', 'Operativo'),
(32, 92, 2, 'SEED-DISP-0026-86J8HR', 'Cámara Perímetro Cablevision', 'Acceso Vehicular', '2025-05-23', 'Operativo'),
(33, 92, 3, 'SEED-DISP-0027-5BWH2U', 'Lector Biométrico Cablevision', 'Acceso Peatonal', '2025-05-26', 'Operativo'),
(34, 65, 1, 'SEED-DISP-0028-W78NWW', 'Panel Principal Cerveceria', 'Entrada Principal', '2025-04-16', 'Operativo'),
(35, 65, 2, 'SEED-DISP-0029-7AYBE1', 'Cámara Entrada Cerveceria', 'Perímetro', '2025-04-17', 'Operativo'),
(36, 60, 1, 'SEED-DISP-0030-PW482O', 'Panel Principal Cine', 'Entrada Principal', '2025-04-15', 'Operativo'),
(37, 10, 1, 'SEED-DISP-0031-6U8RXK', 'Panel Principal Boutique', 'Entrada Principal', '2025-02-13', 'Operativo'),
(38, 18, 1, 'SEED-DISP-0032-IVNN8D', 'Panel Principal Hotel', 'Entrada Principal', '2025-03-01', 'Operativo'),
(39, 11, 1, 'SEED-DISP-0033-9ULGJ0', 'Panel Principal Gimnasio', 'Entrada Principal', '2025-02-14', 'Operativo'),
(40, 39, 1, 'SEED-DISP-0034-N8VUUM', 'Panel Principal Cerrajería', 'Entrada Principal', '2025-03-25', 'Operativo'),
(41, 71, 1, 'SEED-DISP-0035-GU2BE1', 'Panel Principal Starbucks', 'Entrada Principal', '2025-04-27', 'Operativo'),
(42, 100, 1, 'SEED-DISP-0036-A144QR', 'Panel Principal Arenales', 'Entrada Principal', '2026-05-28', 'Operativo'),
(43, 100, 2, 'SEED-DISP-0037-BG6JR4', 'Cámara Depósito Arenales', 'Perímetro', '2026-06-01', 'Operativo'),
(44, 28, 1, 'SEED-DISP-0038-Z1XU9L', 'Panel Principal Kiosco', 'Entrada Principal', '2025-03-07', 'Operativo'),
(45, 28, 2, 'SEED-DISP-0039-23C3P5', 'Cámara Acceso Vehicular Kiosco', 'Perímetro', '2025-03-06', 'Operativo'),
(46, 41, 1, 'SEED-DISP-0040-XXKB8R', 'Panel Principal Laboratorios', 'Entrada Principal', '2025-03-21', 'Operativo'),
(47, 49, 1, 'SEED-DISP-0041-1CEY8Y', 'Panel Principal Colegio', 'Entrada Principal', '2025-03-29', 'Operativo'),
(48, 49, 2, 'SEED-DISP-0042-ND1P43', 'Cámara Acceso Vehicular Colegio', 'Entrada', '2025-04-02', 'Operativo'),
(49, 55, 1, 'SEED-DISP-0043-6ET4OZ', 'Panel Principal Peluqueria', 'Entrada Principal', '2025-04-04', 'Operativo'),
(50, 84, 1, 'SEED-DISP-0044-F8HFGN', 'Panel Principal Ualá', 'Entrada Principal', '2025-05-08', 'Operativo'),
(51, 84, 2, 'SEED-DISP-0045-HEF57W', 'Cámara Depósito Ualá', 'Depósito', '2025-05-07', 'Operativo'),
(52, 42, 1, 'SEED-DISP-0046-9UP7FU', 'Panel Principal Joyeria', 'Entrada Principal', '2025-03-20', 'Operativo'),
(53, 42, 2, 'SEED-DISP-0047-5DIB3P', 'Cámara Acceso Vehicular Joyeria', 'Perímetro', '2025-03-26', 'Operativo'),
(54, 58, 1, 'SEED-DISP-0048-PL5321', 'Panel Principal Estudio', 'Entrada Principal', '2025-04-05', 'Operativo'),
(55, 68, 1, 'SEED-DISP-0049-70RZP2', 'Panel Principal Adidas', 'Entrada Principal', '2025-04-25', 'Operativo'),
(56, 53, 1, 'SEED-DISP-0050-ZF23XQ', 'Panel Principal Sindicato', 'Entrada Principal', '2025-04-01', 'Operativo'),
(57, 85, 1, 'SEED-DISP-0051-8DXVY2', 'Panel Principal Despegarcom', 'Entrada Principal', '2025-05-04', 'Operativo'),
(58, 85, 2, 'SEED-DISP-0052-K322TD', 'Cámara Acceso Vehicular Despegarcom', 'Depósito', '2025-05-03', 'Operativo'),
(59, 7, 1, 'SEED-DISP-0053-5WWXY8', 'Panel Principal Panadería', 'Entrada Principal', '2025-02-04', 'Operativo'),
(60, 29, 1, 'SEED-DISP-0054-2FDP9T', 'Panel Principal Sushi', 'Entrada Principal', '2025-03-13', 'Operativo'),
(61, 29, 2, 'SEED-DISP-0055-6CP6XC', 'Cámara Perímetro Sushi', 'Perímetro', '2025-03-20', 'Operativo'),
(62, 34, 1, 'SEED-DISP-0056-FTYMRH', 'Panel Principal Vivero', 'Entrada Principal', '2025-03-16', 'Operativo'),
(63, 9, 1, 'SEED-DISP-0057-84AW07', 'Panel Principal Taller', 'Entrada Principal', '2025-02-04', 'Operativo'),
(64, 9, 2, 'SEED-DISP-0058-QOEFZG', 'Cámara Depósito Taller', 'Depósito', '2025-02-13', 'Operativo'),
(65, 87, 1, 'SEED-DISP-0059-FHM547', 'Panel Principal Auth0', 'Entrada Principal', '2025-05-05', 'Operativo'),
(66, 87, 2, 'SEED-DISP-0060-5XJESR', 'Cámara Perímetro Auth0', 'Entrada', '2025-05-05', 'Operativo'),
(67, 27, 1, 'SEED-DISP-0061-C565AO', 'Panel Principal Café', 'Entrada Principal', '2025-03-07', 'Operativo'),
(68, 76, 1, 'SEED-DISP-0062-OYPWG6', 'Panel Principal Toyota', 'Entrada Principal', '2025-04-26', 'Operativo'),
(69, 43, 1, 'SEED-DISP-0063-43RANX', 'Panel Principal Fiambreria', 'Entrada Principal', '2025-03-25', 'Operativo'),
(70, 43, 2, 'SEED-DISP-0064-MWW09V', 'Cámara Perímetro Fiambreria', 'Acceso Vehicular', '2025-03-31', 'Operativo'),
(71, 72, 1, 'SEED-DISP-0065-IFGQH2', 'Panel Principal Burger', 'Entrada Principal', '2025-04-22', 'Operativo'),
(72, 72, 2, 'SEED-DISP-0066-VMG4U5', 'Cámara Perímetro Burger', 'Depósito', '2025-04-26', 'Operativo'),
(73, 97, 1, 'SEED-DISP-0067-YZF2Y3', 'Panel Principal Aerolineas', 'Entrada Principal', '2025-05-22', 'Operativo'),
(74, 88, 1, 'SEED-DISP-0068-EDF5A0', 'Panel Principal Personal', 'Entrada Principal', '2025-05-12', 'Operativo'),
(75, 90, 1, 'SEED-DISP-0069-GRKBEN', 'Panel Principal Claro', 'Entrada Principal', '2025-05-07', 'Operativo'),
(76, 64, 1, 'SEED-DISP-0070-AJW44J', 'Panel Principal Techint', 'Entrada Principal', '2025-04-14', 'Operativo'),
(77, 67, 1, 'SEED-DISP-0071-WWH4GE', 'Panel Principal Musimundo', 'Entrada Principal', '2025-04-12', 'Operativo'),
(78, 67, 2, 'SEED-DISP-0072-H4A4U9', 'Cámara Acceso Vehicular Musimundo', 'Perímetro', '2025-04-18', 'Operativo'),
(79, 22, 1, 'SEED-DISP-0073-34E24U', 'Panel Principal Librería', 'Entrada Principal', '2025-02-25', 'Operativo'),
(80, 66, 1, 'SEED-DISP-0074-KZIS77', 'Panel Principal Banco', 'Entrada Principal', '2025-04-16', 'Operativo'),
(81, 66, 2, 'SEED-DISP-0075-9RO1N8', 'Cámara Entrada Banco', 'Entrada', '2025-04-25', 'Operativo'),
(82, 73, 1, 'SEED-DISP-0076-I7Y545', 'Panel Principal YPF', 'Entrada Principal', '2025-04-24', 'Operativo'),
(83, 95, 1, 'SEED-DISP-0077-126R1V', 'Panel Principal Metrogas', 'Entrada Principal', '2025-05-19', 'Operativo'),
(84, 45, 1, 'SEED-DISP-0078-2X5KJF', 'Panel Principal Muebles', 'Entrada Principal', '2025-03-30', 'Operativo'),
(85, 19, 1, 'SEED-DISP-0079-52CE1Z', 'Panel Principal Vidriería', 'Entrada Principal', '2025-02-28', 'Operativo'),
(86, 77, 1, 'SEED-DISP-0080-USEO45', 'Panel Principal Ford', 'Entrada Principal', '2025-05-02', 'Operativo'),
(87, 15, 1, 'SEED-DISP-0081-WF0Y8B', 'Panel Principal Lavadero', 'Entrada Principal', '2025-02-22', 'Operativo'),
(88, 62, 1, 'SEED-DISP-0082-2AFVH4', 'Panel Principal Club', 'Entrada Principal', '2025-04-12', 'Operativo'),
(89, 24, 1, 'SEED-DISP-0083-H89ZJG', 'Panel Principal Farmacia', 'Entrada Principal', '2025-03-08', 'Operativo'),
(90, 13, 1, 'SEED-DISP-0084-XKB91Y', 'Panel Principal Clínica', 'Entrada Principal', '2025-02-15', 'Operativo'),
(91, 83, 1, 'SEED-DISP-0085-8L6DUL', 'Panel Principal Globant', 'Entrada Principal', '2025-05-03', 'Operativo'),
(92, 75, 1, 'SEED-DISP-0086-4JAA6S', 'Panel Principal Axion', 'Entrada Principal', '2025-05-01', 'Operativo'),
(93, 38, 1, 'SEED-DISP-0087-MVO3GA', 'Panel Principal Pastas', 'Entrada Principal', '2025-03-22', 'Operativo'),
(94, 14, 1, 'SEED-DISP-0088-ECLQ50', 'Panel Principal Restaurante', 'Entrada Principal', '2025-02-18', 'Operativo'),
(95, 23, 1, 'SEED-DISP-0089-QBL98H', 'Panel Principal Peluquería', 'Entrada Principal', '2025-03-02', 'Operativo'),
(96, 57, 1, 'SEED-DISP-0090-XL0KZK', 'Panel Principal Drogueria', 'Entrada Principal', '2025-04-03', 'Operativo'),
(97, 44, 1, 'SEED-DISP-0091-4TU2AK', 'Panel Principal Heladeria', 'Entrada Principal', '2025-03-28', 'Operativo'),
(98, 54, 1, 'SEED-DISP-0092-4YV4SE', 'Panel Principal Bar', 'Entrada Principal', '2025-04-04', 'Operativo'),
(99, 40, 1, 'SEED-DISP-0093-OFS4IG', 'Panel Principal Barrio', 'Entrada Principal', '2025-03-22', 'Operativo'),
(100, 50, 1, 'SEED-DISP-0094-7CD1GT', 'Panel Principal Frigorifico', 'Entrada Principal', '2025-04-02', 'Operativo'),
(101, 78, 1, 'SEED-DISP-0095-YC5AIP', 'Panel Principal Volkswagen', 'Entrada Principal', '2025-04-27', 'Operativo'),
(102, 32, 1, 'SEED-DISP-0096-FLUL5A', 'Panel Principal Libreria', 'Entrada Principal', '2025-03-13', 'Operativo'),
(103, 70, 1, 'SEED-DISP-0097-5NDR5I', 'Panel Principal McDonalds', 'Entrada Principal', '2025-04-23', 'Operativo'),
(104, 63, 1, 'SEED-DISP-0098-PYR5V0', 'Panel Principal La', 'Entrada Principal', '2025-04-20', 'Operativo'),
(105, 21, 1, 'SEED-DISP-0099-68Y0GU', 'Panel Principal Inmobiliaria', 'Entrada Principal', '2025-02-24', 'Operativo'),
(106, 36, 1, 'SEED-DISP-0100-N20HGB', 'Panel Principal Consultora', 'Entrada Principal', '2025-03-21', 'Operativo'),
(107, 8, 1, 'SEED-DISP-0101-F8GRAI', 'Panel Principal López', 'Entrada Principal', '2025-02-04', 'Operativo'),
(108, 33, 1, 'SEED-DISP-0102-PGXDYT', 'Panel Principal Optica', 'Entrada Principal', '2025-03-09', 'Operativo'),
(109, 48, 1, 'SEED-DISP-0103-5NPAY9', 'Panel Principal Lavadero', 'Entrada Principal', '2025-03-25', 'Operativo'),
(110, 81, 1, 'SEED-DISP-0104-YDZ1EP', 'Panel Principal Renault', 'Entrada Principal', '2025-05-04', 'Operativo'),
(111, 16, 1, 'SEED-DISP-0105-L42505', 'Panel Principal Distribuidora', 'Entrada Principal', '2025-02-16', 'Operativo'),
(112, 69, 1, 'SEED-DISP-0106-F0G0WJ', 'Panel Principal Nike', 'Entrada Principal', '2025-04-22', 'Operativo'),
(113, 93, 1, 'SEED-DISP-0107-BDK325', 'Panel Principal Edenor', 'Entrada Principal', '2025-05-10', 'Operativo'),
(114, 52, 1, 'SEED-DISP-0108-DIAHOB', 'Panel Principal Kiosco', 'Entrada Principal', '2025-04-04', 'Operativo'),
(115, 82, 1, 'SEED-DISP-0109-JSKQM0', 'Panel Principal Mercado', 'Entrada Principal', '2025-05-06', 'Operativo'),
(116, 20, 1, 'SEED-DISP-0110-HNPBYI', 'Panel Principal PetShop', 'Entrada Principal', '2025-03-01', 'Operativo');

-- --------------------------------------------------------

--
-- Table structure for table `EVENTOS`
--

CREATE TABLE `EVENTOS` (
  `ID_Evento` int NOT NULL,
  `ID_Dispositivo` int NOT NULL,
  `ID_CodigoEvento` int NOT NULL,
  `FechaHoraRecepcion` datetime DEFAULT CURRENT_TIMESTAMP,
  `Estado` varchar(30) NOT NULL DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `EVENTOS`
--

INSERT INTO `EVENTOS` (`ID_Evento`, `ID_Dispositivo`, `ID_CodigoEvento`, `FechaHoraRecepcion`, `Estado`) VALUES
(1, 1, 2, '2026-05-20 19:46:46', 'En Progreso'),
(2, 2, 1, '2026-05-20 19:16:46', 'En Progreso'),
(3, 3, 3, '2026-05-20 18:46:46', 'En Progreso'),
(4, 4, 2, '2026-05-20 17:46:46', 'En Progreso'),
(5, 5, 1, '2026-05-20 16:46:46', 'Cerrado'),
(6, 6, 3, '2026-05-20 15:46:46', 'En Progreso'),
(7, 3, 3, '2026-05-20 21:10:00', 'En Progreso'),
(8, 6, 2, '2026-05-20 21:35:04', 'En Progreso'),
(9, 6, 3, '2026-05-20 18:38:54', 'En Progreso'),
(10, 4, 3, '2026-05-20 19:44:08', 'En Progreso'),
(11, 4, 3, '2026-06-10 18:24:28', 'En Progreso'),
(12, 5, 2, '2026-06-10 18:37:21', 'En Progreso'),
(13, 1, 1, '2026-06-10 18:37:43', 'En Progreso'),
(14, 6, 3, '2026-06-10 18:37:55', 'En Progreso'),
(15, 4, 2, '2026-06-10 18:41:25', 'En Progreso'),
(16, 6, 3, '2026-06-10 18:41:39', 'En Progreso'),
(17, 5, 2, '2026-06-10 19:18:12', 'En Progreso'),
(18, 4, 2, '2026-06-10 20:34:07', 'En Progreso'),
(19, 4, 1, '2026-06-10 20:34:19', 'En Progreso'),
(20, 4, 3, '2026-07-01 00:04:09', 'En Progreso'),
(21, 6, 2, '2026-07-01 00:04:21', 'En Progreso'),
(22, 83, 1, '2026-06-30 19:45:49', 'En Progreso'),
(23, 19, 2, '2026-06-30 20:31:45', 'En Progreso'),
(24, 11, 1, '2026-06-30 14:16:43', 'En Progreso'),
(25, 71, 1, '2026-07-01 05:03:02', 'En Progreso'),
(26, 77, 1, '2026-06-30 21:50:00', 'En Progreso'),
(27, 49, 1, '2026-06-30 20:07:26', 'En Progreso'),
(28, 57, 3, '2026-06-30 22:16:20', 'Cerrado'),
(29, 47, 3, '2026-07-01 05:17:44', 'En Progreso'),
(30, 44, 3, '2026-06-30 20:58:20', 'En Progreso'),
(31, 20, 3, '2026-07-01 06:01:09', 'En Progreso'),
(32, 65, 1, '2026-06-30 16:19:25', 'Cerrado'),
(33, 53, 2, '2026-07-01 03:43:21', 'Cerrado'),
(34, 48, 3, '2026-06-30 12:22:43', 'En Progreso'),
(35, 61, 2, '2026-07-01 05:18:16', 'Cerrado'),
(36, 52, 1, '2026-06-30 23:11:11', 'En Progreso'),
(37, 42, 2, '2026-07-01 10:39:00', 'En Progreso'),
(38, 51, 2, '2026-07-01 04:09:13', 'En Progreso'),
(39, 37, 3, '2026-06-30 22:40:19', 'Cerrado'),
(40, 108, 2, '2026-07-01 10:53:39', 'En Progreso'),
(41, 14, 2, '2026-06-30 15:21:38', 'En Progreso'),
(42, 99, 2, '2026-07-01 05:11:17', 'En Progreso'),
(43, 48, 3, '2026-07-01 02:34:53', 'Cerrado'),
(44, 33, 3, '2026-06-30 21:46:49', 'Cerrado'),
(45, 53, 3, '2026-07-01 10:48:05', 'En Progreso'),
(46, 34, 1, '2026-06-30 13:26:32', 'Cerrado'),
(47, 49, 2, '2026-06-30 20:22:39', 'Cerrado'),
(48, 37, 1, '2026-06-30 12:25:50', 'En Progreso'),
(49, 60, 2, '2026-07-01 10:50:48', 'En Progreso'),
(50, 105, 2, '2026-06-30 16:57:49', 'En Progreso'),
(51, 97, 1, '2026-07-01 11:31:13', 'En Progreso'),
(52, 6, 2, '2026-06-30 15:57:24', 'En Progreso'),
(53, 83, 1, '2026-06-30 20:34:27', 'Cerrado'),
(54, 37, 1, '2026-07-01 05:46:24', 'En Progreso'),
(55, 78, 1, '2026-07-01 06:49:46', 'En Progreso'),
(56, 100, 2, '2026-07-01 02:53:54', 'En Progreso'),
(57, 63, 1, '2026-06-26 01:02:02', 'Cerrado'),
(58, 37, 3, '2026-06-28 16:57:37', 'Cerrado'),
(59, 71, 1, '2026-06-29 04:07:02', 'Cerrado'),
(60, 5, 1, '2026-06-29 03:28:01', 'Cerrado'),
(61, 21, 1, '2026-06-24 14:53:30', 'Cerrado'),
(62, 21, 1, '2026-06-29 13:49:27', 'Cerrado'),
(63, 27, 1, '2026-06-26 23:44:28', 'Cerrado'),
(64, 71, 1, '2026-06-27 09:48:47', 'Cerrado'),
(65, 12, 1, '2026-06-24 17:48:44', 'Cerrado'),
(66, 97, 1, '2026-06-25 22:44:46', 'Cerrado'),
(67, 22, 2, '2026-06-26 14:14:15', 'Cerrado'),
(68, 87, 2, '2026-06-28 20:51:50', 'Cerrado'),
(69, 87, 1, '2026-06-28 21:30:59', 'Cerrado'),
(70, 103, 1, '2026-06-29 00:00:36', 'Cerrado'),
(71, 113, 3, '2026-06-29 01:04:41', 'Cerrado'),
(72, 5, 2, '2026-06-26 03:13:45', 'Cerrado'),
(73, 54, 1, '2026-06-24 17:59:36', 'Cerrado'),
(74, 79, 1, '2026-06-29 12:59:57', 'Cerrado'),
(75, 50, 1, '2026-06-29 22:02:25', 'Cerrado'),
(76, 95, 2, '2026-06-28 10:02:21', 'Cerrado'),
(77, 31, 2, '2026-06-24 19:05:39', 'Cerrado'),
(78, 109, 1, '2026-06-28 03:11:18', 'Cerrado'),
(79, 61, 2, '2026-06-27 21:55:09', 'Cerrado'),
(80, 114, 3, '2026-06-29 17:23:34', 'Cerrado'),
(81, 93, 1, '2026-06-28 13:17:02', 'Cerrado'),
(82, 94, 3, '2026-06-26 16:33:59', 'En Progreso'),
(83, 67, 3, '2026-06-26 20:29:55', 'Cerrado'),
(84, 62, 3, '2026-06-25 14:10:55', 'Cerrado'),
(85, 92, 2, '2026-06-24 18:39:43', 'Cerrado'),
(86, 88, 1, '2026-06-27 17:15:06', 'En Progreso'),
(87, 58, 1, '2026-06-29 22:27:17', 'Cerrado'),
(88, 12, 2, '2026-06-26 11:02:51', 'Cerrado'),
(89, 76, 2, '2026-06-27 08:24:07', 'Cerrado'),
(90, 25, 1, '2026-06-29 16:54:30', 'Cerrado'),
(91, 13, 1, '2026-06-29 09:32:21', 'Cerrado'),
(92, 9, 1, '2026-06-26 19:34:44', 'Cerrado'),
(93, 67, 2, '2026-06-26 21:18:52', 'En Progreso'),
(94, 36, 3, '2026-06-30 01:11:48', 'Cerrado'),
(95, 29, 1, '2026-06-25 16:53:44', 'Cerrado'),
(96, 35, 2, '2026-06-29 22:10:16', 'Cerrado'),
(97, 39, 2, '2026-06-25 20:33:09', 'Cerrado'),
(98, 9, 1, '2026-06-30 02:28:09', 'Cerrado'),
(99, 51, 1, '2026-06-27 20:15:06', 'Cerrado'),
(100, 5, 1, '2026-06-29 00:44:04', 'Cerrado'),
(101, 85, 3, '2026-06-25 20:38:13', 'Cerrado'),
(102, 109, 1, '2026-06-29 05:12:24', 'Cerrado'),
(103, 18, 3, '2026-06-24 20:19:16', 'Cerrado'),
(104, 108, 1, '2026-06-25 04:33:26', 'Cerrado'),
(105, 82, 1, '2026-06-28 11:31:15', 'Cerrado'),
(106, 38, 3, '2026-06-29 04:35:25', 'Cerrado'),
(107, 17, 2, '2026-06-29 08:22:41', 'En Progreso'),
(108, 38, 1, '2026-06-26 11:28:49', 'Cerrado'),
(109, 99, 1, '2026-06-25 17:29:55', 'Cerrado'),
(110, 49, 1, '2026-06-25 16:07:07', 'Cerrado'),
(111, 86, 2, '2026-06-28 06:11:18', 'En Progreso'),
(112, 63, 1, '2026-06-26 18:41:02', 'Cerrado'),
(113, 50, 1, '2026-06-25 06:58:12', 'Cerrado'),
(114, 7, 1, '2026-06-26 02:59:41', 'En Progreso'),
(115, 39, 1, '2026-06-24 14:38:49', 'Cerrado'),
(116, 88, 1, '2026-06-25 01:15:36', 'Cerrado'),
(117, 79, 3, '2026-06-26 15:31:36', 'Cerrado'),
(118, 39, 3, '2026-06-29 23:52:49', 'Cerrado'),
(119, 21, 1, '2026-06-28 20:32:53', 'Cerrado'),
(120, 20, 1, '2026-06-28 18:35:46', 'Cerrado'),
(121, 82, 1, '2026-06-27 14:34:40', 'Cerrado'),
(122, 26, 1, '2026-06-26 21:09:02', 'Cerrado'),
(123, 48, 1, '2026-06-25 01:49:21', 'Cerrado'),
(124, 15, 1, '2026-06-26 04:21:55', 'Cerrado'),
(125, 95, 3, '2026-06-27 18:40:39', 'Cerrado'),
(126, 111, 2, '2026-06-30 09:59:26', 'Cerrado'),
(127, 35, 3, '2026-06-30 01:18:05', 'Cerrado'),
(128, 100, 1, '2026-06-26 00:43:18', 'Cerrado'),
(129, 48, 3, '2026-06-26 05:42:12', 'Cerrado'),
(130, 55, 2, '2026-06-28 08:06:45', 'Cerrado'),
(131, 15, 3, '2026-06-26 17:08:55', 'En Progreso'),
(132, 41, 3, '2026-06-28 20:06:09', 'Cerrado'),
(133, 74, 3, '2026-06-29 12:58:55', 'Cerrado'),
(134, 3, 1, '2026-06-28 04:04:11', 'Cerrado'),
(135, 53, 2, '2026-06-24 16:53:45', 'En Progreso'),
(136, 67, 1, '2026-06-26 11:07:19', 'Cerrado'),
(137, 86, 1, '2026-06-27 18:37:37', 'Cerrado'),
(138, 82, 2, '2026-06-29 06:44:03', 'Cerrado'),
(139, 47, 2, '2026-06-24 21:16:21', 'Cerrado'),
(140, 12, 1, '2026-06-27 22:16:04', 'Cerrado'),
(141, 116, 1, '2026-06-28 17:16:26', 'Cerrado'),
(142, 92, 1, '2026-06-27 06:56:49', 'Cerrado'),
(143, 72, 3, '2026-06-27 09:06:56', 'Cerrado'),
(144, 43, 1, '2026-06-24 22:58:27', 'En Progreso'),
(145, 74, 1, '2026-06-25 17:08:30', 'Cerrado'),
(146, 106, 3, '2026-06-29 16:30:30', 'Cerrado'),
(147, 110, 1, '2026-06-08 13:23:53', 'Cerrado'),
(148, 40, 1, '2026-06-20 15:23:00', 'Cerrado'),
(149, 71, 3, '2026-04-20 05:18:31', 'Cerrado'),
(150, 20, 3, '2026-01-19 06:15:21', 'Cerrado'),
(151, 76, 3, '2026-01-14 21:01:35', 'Cerrado'),
(152, 68, 1, '2026-04-28 06:32:22', 'Cerrado'),
(153, 31, 2, '2026-04-20 04:23:13', 'En Progreso'),
(154, 87, 3, '2026-03-30 05:13:55', 'Cerrado'),
(155, 30, 1, '2026-01-29 13:11:48', 'En Progreso'),
(156, 10, 2, '2026-04-15 06:37:09', 'Cerrado'),
(157, 9, 2, '2026-06-02 01:31:55', 'Cerrado'),
(158, 71, 1, '2026-02-08 18:10:54', 'En Progreso'),
(159, 85, 1, '2026-06-02 09:13:57', 'En Progreso'),
(160, 11, 1, '2026-03-15 14:25:02', 'Cerrado'),
(161, 24, 1, '2026-03-08 18:16:33', 'Cerrado'),
(162, 25, 1, '2026-02-18 09:18:25', 'En Progreso'),
(163, 39, 1, '2026-03-07 18:07:05', 'Cerrado'),
(164, 110, 3, '2026-05-02 07:48:24', 'En Progreso'),
(165, 65, 1, '2026-01-26 14:12:29', 'Cerrado'),
(166, 10, 2, '2026-01-29 16:37:38', 'Cerrado'),
(167, 41, 1, '2026-06-15 00:52:29', 'Cerrado'),
(168, 108, 2, '2026-03-02 11:09:44', 'Cerrado'),
(169, 80, 1, '2026-02-03 12:00:42', 'Cerrado'),
(170, 53, 1, '2026-04-11 15:55:58', 'Cerrado'),
(171, 36, 1, '2026-03-27 23:53:48', 'Cerrado'),
(172, 52, 2, '2026-05-11 04:48:17', 'En Progreso'),
(173, 24, 3, '2026-02-06 23:30:41', 'Cerrado'),
(174, 8, 3, '2026-05-10 20:47:35', 'Cerrado'),
(175, 18, 1, '2026-01-07 05:57:48', 'Cerrado'),
(176, 81, 3, '2026-01-14 08:07:57', 'Cerrado'),
(177, 105, 1, '2026-02-13 01:30:30', 'Cerrado'),
(178, 20, 2, '2026-06-13 17:03:59', 'Cerrado'),
(179, 57, 3, '2026-04-21 00:23:15', 'Cerrado'),
(180, 49, 3, '2026-01-20 00:53:17', 'Cerrado'),
(181, 81, 3, '2026-05-08 10:17:17', 'Cerrado'),
(182, 33, 2, '2026-05-10 04:46:29', 'Cerrado'),
(183, 8, 2, '2026-05-08 20:54:48', 'Cerrado'),
(184, 92, 1, '2026-03-03 22:09:06', 'Cerrado'),
(185, 59, 2, '2026-01-10 20:02:31', 'Cerrado'),
(186, 102, 1, '2026-02-07 14:32:30', 'Cerrado'),
(187, 71, 3, '2026-06-03 11:24:25', 'Cerrado'),
(188, 72, 1, '2026-04-22 00:16:45', 'Cerrado'),
(189, 3, 3, '2026-05-27 08:36:32', 'Cerrado'),
(190, 106, 1, '2026-06-22 05:30:51', 'En Progreso'),
(191, 96, 1, '2026-01-23 17:24:43', 'En Progreso'),
(192, 85, 1, '2026-03-09 12:43:34', 'Cerrado'),
(193, 41, 3, '2026-05-08 01:18:34', 'Cerrado'),
(194, 5, 3, '2026-03-02 12:03:20', 'Cerrado'),
(195, 17, 1, '2026-04-21 08:53:32', 'Cerrado'),
(196, 7, 3, '2026-01-30 07:56:21', 'Cerrado'),
(197, 14, 3, '2026-01-05 00:44:17', 'Cerrado'),
(198, 17, 2, '2026-01-02 01:55:38', 'En Progreso'),
(199, 67, 3, '2026-05-16 18:49:25', 'Cerrado'),
(200, 80, 3, '2026-04-16 09:57:10', 'Cerrado'),
(201, 82, 3, '2026-01-24 05:10:32', 'Cerrado'),
(202, 85, 3, '2026-04-23 06:20:39', 'Cerrado'),
(203, 44, 1, '2026-03-27 18:45:32', 'Cerrado'),
(204, 106, 2, '2026-02-15 01:37:37', 'En Progreso'),
(205, 59, 1, '2026-01-31 05:25:41', 'En Progreso'),
(206, 25, 2, '2026-06-11 05:37:59', 'Cerrado'),
(207, 27, 1, '2026-01-22 05:39:03', 'Cerrado'),
(208, 75, 1, '2026-05-19 09:29:00', 'En Progreso'),
(209, 88, 2, '2026-06-18 01:14:49', 'Cerrado'),
(210, 80, 1, '2026-04-23 04:32:00', 'Cerrado'),
(211, 92, 2, '2026-02-13 17:33:10', 'Cerrado'),
(212, 78, 3, '2026-03-11 14:25:31', 'En Progreso'),
(213, 92, 3, '2026-02-22 05:08:36', 'Cerrado'),
(214, 95, 3, '2026-06-19 07:34:49', 'Cerrado'),
(215, 59, 1, '2026-01-04 02:27:23', 'Cerrado'),
(216, 66, 1, '2026-01-19 17:07:59', 'En Progreso'),
(217, 92, 3, '2026-01-17 02:36:14', 'Cerrado'),
(218, 114, 1, '2026-03-26 19:38:14', 'Cerrado'),
(219, 45, 3, '2026-04-08 05:04:48', 'Cerrado'),
(220, 80, 3, '2026-04-23 17:19:44', 'Cerrado'),
(221, 102, 2, '2026-05-16 21:58:51', 'Cerrado'),
(222, 65, 3, '2026-04-29 09:29:16', 'Cerrado'),
(223, 83, 1, '2026-01-22 23:22:56', 'Cerrado'),
(224, 99, 1, '2026-06-13 12:53:26', 'Cerrado'),
(225, 6, 3, '2026-05-25 21:47:14', 'Cerrado'),
(226, 20, 3, '2026-03-13 15:25:57', 'En Progreso'),
(227, 80, 1, '2026-04-27 16:05:17', 'Cerrado'),
(228, 26, 1, '2026-04-14 05:18:38', 'Cerrado'),
(229, 40, 2, '2026-05-22 19:06:21', 'En Progreso'),
(230, 87, 1, '2026-04-04 21:40:30', 'Cerrado'),
(231, 3, 1, '2026-01-31 03:12:49', 'Cerrado'),
(232, 44, 2, '2026-03-07 20:47:56', 'Cerrado'),
(233, 78, 1, '2026-01-05 11:10:34', 'Cerrado'),
(234, 42, 1, '2026-05-31 18:15:59', 'Cerrado'),
(235, 3, 2, '2026-05-13 16:26:49', 'Cerrado'),
(236, 100, 1, '2026-01-28 07:01:07', 'En Progreso'),
(237, 82, 1, '2026-01-13 14:40:54', 'Cerrado'),
(238, 85, 1, '2026-01-18 22:35:34', 'Cerrado'),
(239, 92, 2, '2026-06-15 09:46:57', 'En Progreso'),
(240, 48, 2, '2026-04-23 21:54:42', 'En Progreso'),
(241, 115, 3, '2026-05-20 16:13:14', 'Cerrado'),
(242, 40, 3, '2026-05-24 12:57:30', 'Cerrado'),
(243, 102, 1, '2026-06-08 03:56:30', 'Cerrado'),
(244, 51, 1, '2026-04-27 18:19:55', 'Cerrado'),
(245, 6, 1, '2026-04-28 18:35:17', 'Cerrado'),
(246, 34, 3, '2026-02-27 14:41:08', 'Cerrado'),
(247, 16, 1, '2026-03-23 23:33:01', 'Cerrado'),
(248, 99, 3, '2026-05-07 09:37:45', 'En Progreso'),
(249, 95, 3, '2026-04-03 08:02:25', 'Cerrado'),
(250, 47, 1, '2026-05-12 06:47:00', 'Cerrado'),
(251, 28, 1, '2026-05-02 17:59:08', 'Cerrado'),
(252, 9, 1, '2026-04-11 18:45:12', 'Cerrado'),
(253, 60, 3, '2026-03-30 11:28:45', 'Cerrado'),
(254, 31, 1, '2026-03-31 22:16:28', 'Cerrado'),
(255, 97, 1, '2026-06-10 06:57:26', 'Cerrado'),
(256, 63, 1, '2026-03-12 03:48:45', 'Cerrado'),
(257, 3, 3, '2026-06-12 23:54:38', 'Cerrado'),
(258, 111, 2, '2026-06-08 21:19:58', 'Cerrado'),
(259, 91, 3, '2026-04-04 07:30:30', 'Cerrado'),
(260, 85, 2, '2026-01-29 00:17:00', 'Cerrado'),
(261, 59, 1, '2026-02-15 22:33:36', 'Cerrado'),
(262, 82, 2, '2026-05-02 21:26:46', 'Cerrado'),
(263, 60, 2, '2026-03-15 19:41:53', 'En Progreso'),
(264, 64, 1, '2026-04-10 00:17:48', 'Cerrado'),
(265, 96, 3, '2026-02-09 23:41:17', 'Cerrado'),
(266, 52, 1, '2026-01-28 14:40:27', 'Cerrado'),
(267, 93, 3, '2026-05-07 16:58:01', 'Cerrado'),
(268, 55, 1, '2026-03-29 07:37:57', 'Cerrado'),
(269, 6, 1, '2026-05-18 14:12:37', 'Cerrado'),
(270, 9, 3, '2026-06-15 03:29:01', 'Cerrado'),
(271, 11, 2, '2026-02-23 16:52:05', 'En Progreso'),
(272, 64, 1, '2026-02-15 12:42:20', 'Cerrado'),
(273, 71, 1, '2026-04-17 22:25:56', 'En Progreso'),
(274, 57, 3, '2026-04-12 23:35:56', 'Cerrado'),
(275, 52, 3, '2026-06-17 03:21:38', 'Cerrado'),
(276, 2, 1, '2026-02-09 07:02:19', 'En Progreso'),
(277, 8, 3, '2026-02-16 02:39:35', 'Cerrado'),
(278, 97, 1, '2026-04-21 22:38:38', 'En Progreso'),
(279, 9, 1, '2026-02-12 04:32:06', 'Cerrado'),
(280, 9, 1, '2026-02-05 20:07:30', 'Cerrado'),
(281, 88, 1, '2026-04-28 22:30:59', 'Cerrado'),
(282, 34, 2, '2026-03-07 12:33:02', 'Cerrado'),
(283, 83, 3, '2026-01-14 20:47:55', 'Cerrado'),
(284, 111, 2, '2026-01-15 19:55:10', 'En Progreso'),
(285, 5, 1, '2026-01-04 20:20:18', 'Cerrado'),
(286, 108, 3, '2026-06-07 08:15:05', 'Cerrado'),
(287, 93, 2, '2026-04-03 12:40:36', 'En Progreso'),
(288, 104, 1, '2026-06-09 10:38:33', 'Cerrado'),
(289, 112, 1, '2026-01-19 01:31:32', 'Cerrado'),
(290, 73, 1, '2026-02-14 13:07:29', 'En Progreso'),
(291, 82, 2, '2026-03-27 12:25:15', 'Cerrado'),
(292, 66, 1, '2026-05-15 13:40:42', 'Cerrado'),
(293, 1, 2, '2026-01-15 04:16:24', 'En Progreso'),
(294, 79, 3, '2026-01-17 17:43:05', 'Cerrado'),
(295, 4, 2, '2026-03-29 21:17:02', 'Cerrado'),
(296, 73, 1, '2026-05-10 03:25:25', 'Cerrado'),
(297, 110, 2, '2026-02-26 00:55:32', 'En Progreso'),
(298, 69, 2, '2026-06-07 10:09:20', 'Cerrado'),
(299, 20, 1, '2026-02-16 22:31:50', 'Cerrado'),
(300, 23, 3, '2026-02-10 03:33:24', 'Cerrado'),
(301, 2, 1, '2026-03-21 17:48:59', 'Cerrado'),
(302, 63, 1, '2026-01-15 19:00:31', 'Cerrado'),
(303, 61, 1, '2026-04-13 02:56:22', 'Cerrado'),
(304, 91, 1, '2026-04-30 23:37:15', 'Cerrado'),
(305, 96, 3, '2026-03-19 12:19:21', 'Cerrado'),
(306, 86, 1, '2026-02-13 09:57:04', 'Cerrado'),
(307, 66, 3, '2026-02-21 16:42:45', 'Cerrado'),
(308, 41, 3, '2026-05-21 21:43:36', 'Cerrado'),
(309, 113, 1, '2026-06-18 07:17:46', 'Cerrado'),
(310, 40, 1, '2026-03-21 08:57:13', 'Cerrado'),
(311, 1, 1, '2026-05-02 13:05:06', 'Cerrado'),
(312, 15, 1, '2026-03-12 19:25:50', 'En Progreso'),
(313, 65, 2, '2026-03-28 20:39:30', 'En Progreso'),
(314, 89, 1, '2026-03-31 03:01:23', 'Cerrado'),
(315, 95, 1, '2026-04-03 12:51:32', 'Cerrado'),
(316, 104, 2, '2026-03-19 12:57:06', 'En Progreso'),
(317, 18, 3, '2026-02-08 16:26:09', 'Cerrado'),
(318, 47, 1, '2026-04-04 13:42:55', 'En Progreso'),
(319, 37, 2, '2026-05-08 10:11:20', 'Cerrado'),
(320, 84, 2, '2026-04-18 16:50:33', 'En Progreso'),
(321, 42, 1, '2026-06-04 18:59:25', 'Cerrado'),
(322, 83, 2, '2026-04-10 12:59:50', 'Cerrado'),
(323, 74, 2, '2026-03-28 12:19:09', 'Cerrado'),
(324, 113, 3, '2026-01-12 05:50:41', 'En Progreso'),
(325, 103, 3, '2026-04-27 16:53:29', 'Cerrado'),
(326, 107, 3, '2026-06-20 06:10:13', 'Cerrado'),
(327, 101, 3, '2026-05-28 12:33:56', 'Cerrado'),
(328, 51, 1, '2026-02-11 18:55:18', 'Cerrado'),
(329, 64, 3, '2026-03-28 05:05:21', 'Cerrado'),
(330, 49, 3, '2026-04-10 14:01:56', 'Cerrado'),
(331, 31, 1, '2026-03-09 23:01:36', 'En Progreso'),
(332, 53, 3, '2026-04-03 20:34:14', 'Cerrado'),
(333, 7, 1, '2026-05-26 17:23:57', 'Cerrado'),
(334, 17, 3, '2026-01-25 02:40:28', 'En Progreso'),
(335, 104, 3, '2026-03-09 09:27:02', 'Cerrado'),
(336, 29, 3, '2026-02-10 12:38:15', 'Cerrado'),
(337, 88, 1, '2026-02-13 19:58:45', 'Cerrado'),
(338, 99, 1, '2026-01-23 21:52:14', 'Cerrado'),
(339, 109, 3, '2026-03-04 05:41:38', 'Cerrado'),
(340, 82, 3, '2026-06-16 01:41:12', 'En Progreso'),
(341, 61, 1, '2026-05-26 03:50:23', 'Cerrado'),
(342, 94, 3, '2026-03-17 00:33:05', 'Cerrado'),
(343, 106, 1, '2026-02-16 07:47:09', 'Cerrado'),
(344, 102, 3, '2026-06-16 08:37:21', 'Cerrado'),
(345, 79, 3, '2026-04-25 02:45:59', 'Cerrado'),
(346, 10, 2, '2026-03-03 09:41:46', 'Cerrado'),
(347, 34, 1, '2026-06-19 01:51:58', 'Cerrado'),
(348, 24, 1, '2026-06-22 10:51:47', 'Cerrado'),
(349, 20, 1, '2026-04-05 06:09:14', 'Cerrado'),
(350, 99, 1, '2026-01-27 21:44:49', 'Cerrado'),
(351, 105, 2, '2026-05-31 09:10:19', 'Cerrado'),
(352, 85, 1, '2026-06-07 07:25:16', 'Cerrado'),
(353, 75, 2, '2026-01-19 11:14:34', 'Cerrado'),
(354, 2, 1, '2026-04-10 02:28:08', 'En Progreso'),
(355, 18, 2, '2026-05-13 06:14:46', 'Cerrado'),
(356, 44, 1, '2026-04-10 11:23:08', 'Cerrado'),
(357, 54, 1, '2026-06-11 02:17:55', 'Cerrado'),
(358, 70, 3, '2026-01-03 00:33:06', 'Cerrado'),
(359, 57, 2, '2026-04-30 13:56:31', 'Cerrado'),
(360, 19, 2, '2026-04-07 11:09:07', 'Cerrado'),
(361, 8, 3, '2026-02-16 15:32:42', 'Cerrado'),
(362, 81, 1, '2026-02-12 15:13:02', 'Cerrado'),
(363, 41, 1, '2026-02-03 12:15:47', 'Cerrado'),
(364, 74, 3, '2026-06-05 01:18:12', 'En Progreso'),
(365, 97, 3, '2026-06-16 23:20:22', 'Cerrado'),
(366, 20, 1, '2026-02-02 10:41:00', 'Cerrado'),
(367, 91, 3, '2026-04-27 07:17:47', 'Cerrado'),
(368, 52, 1, '2026-05-17 04:20:54', 'Cerrado'),
(369, 64, 1, '2026-06-10 00:06:52', 'En Progreso'),
(370, 77, 3, '2026-05-01 00:00:30', 'En Progreso'),
(371, 94, 1, '2026-03-28 23:53:06', 'Cerrado'),
(372, 48, 1, '2026-03-27 17:31:15', 'Cerrado'),
(373, 89, 3, '2026-03-23 00:56:20', 'Cerrado'),
(374, 71, 1, '2026-04-20 19:25:34', 'En Progreso'),
(375, 3, 1, '2026-06-17 04:23:12', 'Cerrado'),
(376, 26, 1, '2026-02-04 05:45:05', 'Cerrado'),
(377, 95, 1, '2026-04-24 16:28:22', 'Cerrado'),
(378, 40, 1, '2026-05-27 07:13:56', 'En Progreso'),
(379, 111, 1, '2026-03-26 09:07:33', 'Cerrado'),
(380, 51, 1, '2026-01-17 21:12:29', 'Cerrado'),
(381, 1, 1, '2026-05-19 14:01:59', 'En Progreso'),
(382, 15, 1, '2026-02-01 21:02:50', 'Cerrado'),
(383, 75, 3, '2026-05-20 00:00:24', 'Cerrado'),
(384, 78, 2, '2026-02-04 00:11:12', 'Cerrado'),
(385, 112, 1, '2026-06-16 13:46:55', 'Cerrado'),
(386, 45, 3, '2026-01-11 14:32:13', 'Cerrado'),
(387, 41, 1, '2026-05-01 02:01:52', 'Cerrado'),
(388, 37, 1, '2026-05-31 03:11:07', 'Cerrado'),
(389, 112, 1, '2026-02-02 17:24:12', 'Cerrado'),
(390, 85, 2, '2026-01-31 12:42:14', 'Cerrado'),
(391, 87, 2, '2026-03-26 21:04:47', 'Cerrado'),
(392, 102, 3, '2026-01-17 06:27:32', 'Cerrado'),
(393, 59, 1, '2026-04-10 17:28:24', 'Cerrado'),
(394, 49, 3, '2026-06-09 23:55:26', 'En Progreso'),
(395, 24, 3, '2026-06-14 12:37:05', 'Cerrado'),
(396, 53, 3, '2026-05-30 19:15:32', 'En Progreso'),
(397, 113, 1, '2026-04-11 00:31:18', 'Cerrado'),
(398, 46, 3, '2026-03-03 00:45:06', 'Cerrado'),
(399, 10, 3, '2026-03-08 11:18:53', 'Cerrado'),
(400, 94, 3, '2026-06-03 22:23:17', 'Cerrado'),
(401, 40, 1, '2026-01-25 09:42:55', 'Cerrado'),
(402, 60, 3, '2026-04-20 04:31:37', 'Cerrado'),
(403, 22, 1, '2026-06-06 16:38:13', 'Cerrado'),
(404, 81, 3, '2026-03-03 23:59:47', 'Cerrado'),
(405, 88, 1, '2026-01-23 17:35:57', 'Cerrado'),
(406, 81, 1, '2026-01-02 11:07:43', 'Cerrado'),
(407, 44, 1, '2026-05-27 05:01:46', 'En Progreso'),
(408, 67, 2, '2026-01-23 09:00:28', 'Cerrado'),
(409, 3, 2, '2026-01-09 15:15:22', 'Cerrado'),
(410, 87, 1, '2026-01-24 10:47:29', 'Cerrado'),
(411, 71, 1, '2026-04-04 10:11:53', 'Cerrado'),
(412, 85, 1, '2026-03-06 19:08:54', 'En Progreso'),
(413, 102, 2, '2026-06-02 14:43:05', 'Cerrado'),
(414, 101, 1, '2026-02-07 00:26:49', 'Cerrado'),
(415, 85, 3, '2026-02-24 05:17:13', 'Cerrado'),
(416, 41, 1, '2026-02-27 18:13:05', 'Cerrado'),
(417, 34, 3, '2026-03-19 14:00:05', 'Cerrado'),
(418, 20, 1, '2026-04-18 06:27:20', 'Cerrado'),
(419, 13, 3, '2026-04-05 02:46:51', 'Cerrado'),
(420, 8, 1, '2026-06-03 06:17:01', 'Cerrado'),
(421, 38, 3, '2026-03-20 03:39:33', 'Cerrado'),
(422, 47, 1, '2026-02-14 10:56:48', 'Cerrado'),
(423, 69, 1, '2026-06-07 22:35:26', 'Cerrado'),
(424, 63, 1, '2026-01-23 11:35:37', 'Cerrado'),
(425, 112, 1, '2026-05-14 06:00:33', 'Cerrado'),
(426, 57, 1, '2026-06-01 23:04:15', 'Cerrado'),
(427, 65, 1, '2026-03-12 08:34:11', 'Cerrado'),
(428, 107, 1, '2026-03-06 18:42:52', 'Cerrado'),
(429, 109, 1, '2026-04-17 23:14:56', 'En Progreso'),
(430, 110, 1, '2026-04-12 13:51:21', 'Cerrado'),
(431, 51, 3, '2026-01-11 06:48:40', 'Cerrado'),
(432, 27, 1, '2026-03-16 10:22:14', 'Cerrado'),
(433, 114, 3, '2026-03-01 11:42:06', 'Cerrado'),
(434, 21, 2, '2026-05-21 16:44:07', 'Cerrado'),
(435, 88, 1, '2026-01-09 11:17:13', 'Cerrado'),
(436, 34, 2, '2026-05-13 18:18:08', 'Cerrado'),
(437, 19, 1, '2026-01-08 07:07:45', 'Cerrado'),
(438, 75, 1, '2026-02-16 05:32:11', 'Cerrado'),
(439, 60, 2, '2026-01-19 15:01:49', 'Cerrado'),
(440, 54, 2, '2026-06-20 20:01:41', 'Cerrado'),
(441, 19, 3, '2026-05-26 12:03:31', 'Cerrado'),
(442, 17, 3, '2026-06-21 17:47:00', 'En Progreso'),
(443, 8, 1, '2026-01-22 18:04:05', 'Cerrado'),
(444, 19, 3, '2026-05-12 11:16:08', 'En Progreso'),
(445, 78, 1, '2026-05-15 05:33:03', 'Cerrado'),
(446, 65, 1, '2026-05-27 15:03:42', 'Cerrado'),
(447, 113, 1, '2026-05-04 08:33:12', 'Cerrado'),
(448, 66, 2, '2026-04-15 01:54:09', 'En Progreso'),
(449, 92, 2, '2026-05-24 11:51:40', 'En Progreso'),
(450, 75, 3, '2026-06-10 03:22:22', 'Cerrado'),
(451, 73, 1, '2026-06-19 01:04:55', 'En Progreso'),
(452, 110, 2, '2026-05-16 02:59:36', 'En Progreso'),
(453, 72, 1, '2026-01-05 00:12:07', 'Cerrado'),
(454, 92, 1, '2026-01-21 03:21:57', 'En Progreso'),
(455, 81, 3, '2026-01-11 08:52:21', 'En Progreso'),
(456, 97, 1, '2026-01-10 09:50:25', 'Cerrado'),
(457, 107, 1, '2026-02-20 14:24:27', 'Cerrado'),
(458, 31, 3, '2026-02-24 07:02:42', 'Cerrado'),
(459, 73, 2, '2026-06-17 12:22:22', 'En Progreso'),
(460, 65, 3, '2026-04-27 01:50:40', 'Cerrado'),
(461, 103, 2, '2026-02-22 03:06:27', 'Cerrado'),
(462, 53, 2, '2026-03-27 05:09:40', 'Cerrado'),
(463, 16, 1, '2026-05-16 21:33:20', 'Cerrado'),
(464, 41, 2, '2026-02-23 03:28:20', 'Cerrado'),
(465, 64, 2, '2026-03-08 10:57:03', 'En Progreso'),
(466, 65, 1, '2026-04-13 07:54:17', 'Cerrado'),
(467, 66, 1, '2026-05-08 00:51:44', 'En Progreso'),
(468, 84, 2, '2026-04-18 14:56:15', 'Cerrado'),
(469, 55, 1, '2026-03-04 13:12:32', 'Cerrado'),
(470, 47, 3, '2026-03-31 05:35:35', 'Cerrado'),
(471, 30, 2, '2026-02-25 01:13:36', 'Cerrado'),
(472, 112, 3, '2026-02-02 19:40:10', 'Cerrado'),
(473, 98, 1, '2026-02-12 22:25:25', 'Cerrado'),
(474, 66, 3, '2026-04-14 19:04:39', 'Cerrado'),
(475, 113, 1, '2026-02-07 00:56:08', 'Cerrado'),
(476, 54, 2, '2026-04-14 04:48:32', 'Cerrado'),
(477, 103, 2, '2026-06-15 03:50:25', 'Cerrado'),
(478, 15, 3, '2026-06-03 05:53:36', 'Cerrado'),
(479, 21, 3, '2026-03-21 10:52:00', 'Cerrado'),
(480, 5, 1, '2026-02-07 03:42:25', 'En Progreso'),
(481, 62, 3, '2026-04-01 20:16:43', 'Cerrado'),
(482, 56, 3, '2026-04-21 00:08:13', 'En Progreso'),
(483, 51, 3, '2026-05-21 12:50:48', 'En Progreso'),
(484, 88, 1, '2026-05-29 19:16:51', 'En Progreso'),
(485, 84, 1, '2026-03-17 02:09:18', 'En Progreso'),
(486, 69, 1, '2026-01-13 02:04:55', 'En Progreso'),
(487, 20, 1, '2026-01-10 10:31:57', 'Cerrado'),
(488, 115, 3, '2026-02-09 21:32:47', 'Cerrado'),
(489, 75, 2, '2026-06-13 19:50:04', 'Cerrado'),
(490, 104, 3, '2026-01-31 16:46:46', 'Cerrado'),
(491, 56, 1, '2026-06-13 09:30:05', 'Cerrado'),
(492, 90, 1, '2026-05-14 13:32:06', 'Cerrado'),
(493, 25, 2, '2026-01-10 09:07:46', 'En Progreso'),
(494, 64, 2, '2026-06-06 04:02:52', 'Cerrado'),
(495, 44, 3, '2026-06-09 02:37:29', 'Cerrado'),
(496, 12, 2, '2026-03-31 23:34:03', 'Cerrado'),
(497, 111, 2, '2026-03-08 19:15:52', 'Cerrado'),
(498, 50, 3, '2026-05-09 12:49:52', 'Cerrado'),
(499, 86, 3, '2026-03-05 04:06:29', 'Cerrado'),
(500, 7, 1, '2026-06-01 02:48:30', 'Cerrado'),
(501, 90, 3, '2026-05-07 09:36:20', 'Cerrado'),
(502, 46, 3, '2026-04-08 10:05:15', 'Cerrado'),
(503, 41, 1, '2026-05-23 11:56:09', 'Cerrado'),
(504, 81, 3, '2026-04-08 16:39:56', 'Cerrado'),
(505, 72, 1, '2026-04-01 00:37:49', 'En Progreso'),
(506, 68, 1, '2026-03-04 06:59:37', 'Cerrado'),
(507, 24, 3, '2026-05-12 15:20:43', 'Cerrado'),
(508, 110, 2, '2026-04-14 03:24:41', 'Cerrado'),
(509, 9, 1, '2026-01-12 21:14:17', 'Cerrado'),
(510, 58, 1, '2026-01-31 11:06:15', 'En Progreso'),
(511, 63, 1, '2026-03-27 04:02:44', 'Cerrado'),
(512, 79, 1, '2026-06-15 16:42:23', 'En Progreso'),
(513, 63, 1, '2026-04-01 06:28:51', 'Cerrado'),
(514, 76, 1, '2026-04-24 10:52:47', 'En Progreso'),
(515, 32, 1, '2026-01-18 12:07:45', 'En Progreso'),
(516, 47, 3, '2026-05-10 04:52:45', 'Cerrado'),
(517, 21, 1, '2026-04-22 14:14:18', 'Cerrado'),
(518, 96, 1, '2026-05-26 20:42:27', 'En Progreso'),
(519, 80, 3, '2026-03-23 17:21:57', 'Cerrado'),
(520, 115, 3, '2026-01-01 04:45:50', 'Cerrado'),
(521, 19, 2, '2026-04-22 23:10:26', 'En Progreso'),
(522, 44, 2, '2026-06-17 08:15:02', 'Cerrado'),
(523, 92, 2, '2026-05-22 03:49:24', 'Cerrado'),
(524, 55, 3, '2026-04-28 14:00:39', 'Cerrado'),
(525, 65, 2, '2026-04-16 09:08:20', 'Cerrado'),
(526, 83, 2, '2026-04-25 14:11:01', 'Cerrado'),
(527, 108, 3, '2026-02-09 20:58:53', 'Cerrado'),
(528, 9, 1, '2026-02-11 22:51:08', 'Cerrado'),
(529, 111, 1, '2026-05-30 15:39:25', 'Cerrado'),
(530, 26, 3, '2026-03-28 06:08:00', 'Cerrado'),
(531, 82, 3, '2026-05-19 02:24:39', 'En Progreso'),
(532, 36, 3, '2026-05-06 01:13:31', 'Cerrado'),
(533, 2, 2, '2026-05-11 03:14:41', 'Cerrado'),
(534, 39, 1, '2026-04-02 22:41:15', 'Cerrado'),
(535, 41, 2, '2026-06-01 19:58:46', 'Cerrado'),
(536, 75, 1, '2026-05-13 18:24:22', 'Cerrado'),
(537, 95, 1, '2026-02-01 01:05:02', 'Cerrado'),
(538, 19, 1, '2026-02-15 02:06:08', 'En Progreso'),
(539, 59, 3, '2026-05-31 08:43:50', 'Cerrado'),
(540, 30, 1, '2026-06-23 15:09:55', 'Cerrado'),
(541, 70, 3, '2026-05-27 00:06:31', 'En Progreso'),
(542, 53, 3, '2026-02-13 00:45:16', 'En Progreso'),
(543, 105, 2, '2026-05-26 18:51:51', 'Cerrado'),
(544, 95, 2, '2026-04-17 11:29:55', 'Cerrado'),
(545, 96, 1, '2026-02-25 22:17:22', 'Cerrado'),
(546, 80, 1, '2026-06-10 18:48:18', 'Cerrado'),
(547, 44, 3, '2026-02-02 13:47:46', 'Cerrado'),
(548, 56, 1, '2026-04-27 23:56:37', 'Cerrado'),
(549, 37, 3, '2026-06-19 18:56:47', 'Cerrado'),
(550, 97, 3, '2026-03-09 00:07:34', 'Cerrado'),
(551, 7, 1, '2026-02-25 05:29:21', 'Cerrado'),
(552, 72, 1, '2026-06-06 11:49:47', 'En Progreso'),
(553, 40, 1, '2026-05-25 03:26:41', 'Cerrado'),
(554, 7, 3, '2026-02-03 14:21:03', 'Cerrado'),
(555, 1, 1, '2026-04-08 01:46:28', 'En Progreso'),
(556, 58, 3, '2026-01-02 08:16:59', 'En Progreso'),
(557, 51, 3, '2026-03-14 09:10:50', 'Cerrado'),
(558, 60, 1, '2026-01-02 02:00:37', 'Cerrado'),
(559, 60, 1, '2026-03-28 07:23:51', 'Cerrado'),
(560, 75, 3, '2026-04-11 17:40:17', 'En Progreso'),
(561, 7, 2, '2026-02-20 06:03:35', 'Cerrado'),
(562, 109, 1, '2026-06-07 04:15:00', 'Cerrado'),
(563, 8, 1, '2026-05-08 23:05:41', 'Cerrado'),
(564, 59, 1, '2026-05-13 06:34:09', 'Cerrado'),
(565, 112, 1, '2026-05-16 22:17:01', 'En Progreso'),
(566, 91, 2, '2026-06-21 05:33:18', 'Cerrado'),
(567, 81, 1, '2026-02-06 22:01:36', 'Cerrado'),
(568, 71, 1, '2026-05-23 15:35:54', 'En Progreso'),
(569, 63, 3, '2026-02-24 01:13:14', 'Cerrado'),
(570, 56, 2, '2026-06-13 05:38:52', 'En Progreso'),
(571, 91, 1, '2026-04-25 23:37:56', 'Cerrado'),
(572, 93, 1, '2026-04-11 23:33:58', 'Cerrado'),
(573, 85, 2, '2026-05-02 22:45:56', 'Cerrado'),
(574, 96, 3, '2026-05-30 05:39:14', 'Cerrado'),
(575, 71, 2, '2026-05-03 12:39:25', 'Cerrado'),
(576, 95, 1, '2026-04-25 17:16:25', 'Cerrado'),
(577, 85, 3, '2026-02-25 09:40:36', 'Cerrado'),
(578, 68, 2, '2026-03-16 17:17:55', 'Cerrado'),
(579, 6, 1, '2026-04-17 10:21:18', 'Cerrado'),
(580, 90, 3, '2026-03-14 10:00:15', 'Cerrado'),
(581, 98, 1, '2026-04-16 12:27:52', 'Cerrado'),
(582, 31, 3, '2026-04-09 23:06:58', 'Cerrado'),
(583, 10, 1, '2026-05-20 04:19:57', 'Cerrado'),
(584, 88, 1, '2026-02-21 21:22:09', 'Cerrado'),
(585, 70, 3, '2026-06-01 19:18:50', 'En Progreso'),
(586, 57, 3, '2026-02-11 23:06:04', 'Cerrado'),
(587, 10, 1, '2026-01-26 13:54:00', 'Cerrado'),
(588, 109, 1, '2026-04-08 15:07:05', 'Cerrado'),
(589, 103, 1, '2026-01-21 03:08:34', 'En Progreso'),
(590, 1, 1, '2026-05-25 18:23:31', 'En Progreso'),
(591, 91, 1, '2026-01-15 04:28:38', 'Cerrado'),
(592, 16, 2, '2026-05-30 01:01:13', 'Cerrado'),
(593, 101, 1, '2026-06-17 05:09:48', 'En Progreso'),
(594, 17, 1, '2026-03-09 13:57:08', 'Cerrado'),
(595, 75, 1, '2026-05-25 00:55:59', 'Cerrado'),
(596, 55, 3, '2026-06-13 07:12:55', 'Cerrado'),
(597, 32, 3, '2026-01-24 18:51:20', 'Cerrado'),
(598, 31, 1, '2026-05-26 05:34:44', 'Cerrado'),
(599, 58, 1, '2026-04-15 04:06:17', 'Cerrado'),
(600, 40, 1, '2026-03-10 22:22:31', 'Cerrado'),
(601, 18, 2, '2026-03-07 22:49:41', 'Cerrado'),
(602, 108, 3, '2026-06-03 10:00:53', 'Cerrado'),
(603, 40, 3, '2026-06-01 22:04:08', 'Cerrado'),
(604, 18, 2, '2026-02-19 19:11:39', 'Cerrado'),
(605, 38, 3, '2026-04-22 14:33:03', 'En Progreso'),
(606, 107, 3, '2026-05-16 14:23:27', 'Cerrado'),
(607, 3, 1, '2026-01-27 20:47:47', 'En Progreso'),
(608, 11, 2, '2026-05-14 08:43:42', 'Cerrado'),
(609, 40, 3, '2026-02-24 12:45:22', 'Cerrado'),
(610, 36, 3, '2026-03-07 11:47:29', 'En Progreso'),
(611, 76, 2, '2026-06-09 12:28:47', 'Cerrado'),
(612, 107, 1, '2026-04-21 04:57:09', 'Cerrado'),
(613, 6, 1, '2026-04-08 10:46:48', 'Cerrado'),
(614, 6, 3, '2026-01-16 17:07:42', 'Cerrado'),
(615, 47, 1, '2026-06-05 09:07:42', 'Cerrado'),
(616, 60, 1, '2026-01-26 09:24:39', 'Cerrado'),
(617, 108, 2, '2026-04-25 23:23:01', 'Cerrado'),
(618, 20, 1, '2026-02-02 22:21:12', 'Cerrado'),
(619, 25, 3, '2026-03-19 12:04:27', 'Cerrado'),
(620, 44, 3, '2026-04-19 11:46:02', 'Cerrado'),
(621, 52, 1, '2026-02-19 19:54:12', 'Cerrado'),
(622, 37, 2, '2026-03-20 14:56:47', 'Cerrado'),
(623, 16, 1, '2026-01-05 18:27:46', 'En Progreso'),
(624, 101, 3, '2026-03-03 15:52:09', 'Cerrado'),
(625, 78, 1, '2026-05-18 08:31:25', 'Cerrado'),
(626, 19, 1, '2026-06-21 14:03:18', 'Cerrado'),
(627, 62, 1, '2026-04-02 12:00:02', 'Cerrado'),
(628, 92, 3, '2026-04-13 11:13:57', 'Cerrado'),
(629, 11, 2, '2026-05-11 07:52:47', 'Cerrado'),
(630, 85, 1, '2026-01-11 21:14:07', 'Cerrado'),
(631, 55, 1, '2026-06-02 15:28:03', 'En Progreso'),
(632, 89, 3, '2026-04-10 16:27:58', 'Cerrado'),
(633, 26, 3, '2026-05-04 15:32:54', 'Cerrado'),
(634, 59, 1, '2026-06-03 16:29:00', 'En Progreso'),
(635, 47, 1, '2026-02-27 17:23:35', 'Cerrado'),
(636, 27, 3, '2026-03-14 21:10:56', 'Cerrado'),
(637, 47, 1, '2026-06-06 00:45:43', 'Cerrado'),
(638, 112, 1, '2026-06-08 18:28:54', 'Cerrado'),
(639, 106, 1, '2026-06-21 10:04:50', 'Cerrado'),
(640, 51, 3, '2026-01-24 19:21:35', 'Cerrado'),
(641, 12, 3, '2026-03-25 03:26:06', 'En Progreso'),
(642, 96, 3, '2026-06-08 17:08:02', 'Cerrado'),
(643, 83, 1, '2026-05-29 03:39:42', 'En Progreso'),
(644, 65, 2, '2026-04-04 09:09:18', 'Cerrado'),
(645, 61, 2, '2026-06-21 19:27:54', 'Cerrado'),
(646, 13, 1, '2026-06-07 08:13:07', 'Cerrado'),
(647, 76, 1, '2026-06-10 10:20:41', 'Cerrado'),
(648, 97, 3, '2026-02-28 16:24:09', 'Cerrado'),
(649, 74, 1, '2026-02-26 13:28:36', 'Cerrado'),
(650, 90, 3, '2026-03-27 08:57:14', 'Cerrado'),
(651, 23, 3, '2026-03-07 10:20:58', 'Cerrado'),
(652, 111, 3, '2026-04-16 11:49:03', 'Cerrado'),
(653, 22, 1, '2026-05-08 12:58:16', 'En Progreso'),
(654, 69, 1, '2026-04-04 02:56:59', 'Cerrado'),
(655, 8, 1, '2026-01-06 12:29:47', 'En Progreso'),
(656, 46, 3, '2026-02-09 03:08:02', 'Cerrado'),
(657, 18, 3, '2026-04-08 01:52:15', 'Cerrado'),
(658, 80, 1, '2026-01-01 07:34:29', 'Cerrado'),
(659, 48, 3, '2026-03-29 01:38:34', 'Cerrado'),
(660, 74, 2, '2026-03-03 16:34:00', 'Cerrado'),
(661, 89, 2, '2026-03-21 14:57:09', 'Cerrado'),
(662, 11, 1, '2026-04-10 23:57:48', 'Cerrado'),
(663, 6, 1, '2026-01-23 00:05:10', 'Cerrado'),
(664, 16, 3, '2026-05-30 15:58:05', 'Cerrado'),
(665, 41, 3, '2026-01-16 17:20:11', 'Cerrado'),
(666, 74, 1, '2026-04-09 06:00:15', 'Cerrado'),
(667, 49, 3, '2026-03-04 18:40:43', 'Cerrado'),
(668, 34, 1, '2026-02-09 07:08:26', 'Cerrado'),
(669, 41, 3, '2026-01-25 07:09:00', 'Cerrado'),
(670, 97, 1, '2026-06-17 04:34:41', 'Cerrado'),
(671, 85, 1, '2026-02-16 22:07:13', 'Cerrado'),
(672, 96, 17, '2026-07-05 14:13:28', 'En Progreso'),
(673, 23, 8, '2026-07-05 14:13:58', 'En Progreso'),
(674, 91, 3, '2026-07-08 18:14:20', 'En Progreso'),
(675, 20, 9, '2026-07-08 18:14:36', 'En Progreso'),
(676, 72, 12, '2026-07-08 18:14:49', 'En Progreso'),
(677, 81, 6, '2026-07-08 18:15:04', 'En Progreso');

-- --------------------------------------------------------

--
-- Table structure for table `MODELOS_DISPOSITIVOS`
--

CREATE TABLE `MODELOS_DISPOSITIVOS` (
  `ID_Modelo` int NOT NULL,
  `NombreModelo` varchar(100) NOT NULL,
  `Fabricante` varchar(50) DEFAULT NULL,
  `TipoDispositivo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `MODELOS_DISPOSITIVOS`
--

INSERT INTO `MODELOS_DISPOSITIVOS` (`ID_Modelo`, `NombreModelo`, `Fabricante`, `TipoDispositivo`) VALUES
(1, 'Panel NEO-HS2032', 'DSC', 'Alarma'),
(2, 'Cámara Domo IP-4MP', 'HIKVISION', 'CCTV'),
(3, 'Lector Huella Biométrica V3', 'ZKTECO', 'Acceso');

-- --------------------------------------------------------

--
-- Table structure for table `PLANES_CONTRATADOS`
--

CREATE TABLE `PLANES_CONTRATADOS` (
  `ID_PlanContratado` int NOT NULL,
  `ID_Abonado` int NOT NULL,
  `ID_ServicioBase` int NOT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFinPrevista` date DEFAULT NULL,
  `Costo` decimal(10,2) DEFAULT NULL,
  `EstadoContrato` varchar(20) NOT NULL DEFAULT 'Vigente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `PLANES_CONTRATADOS`
--

INSERT INTO `PLANES_CONTRATADOS` (`ID_PlanContratado`, `ID_Abonado`, `ID_ServicioBase`, `FechaInicio`, `FechaFinPrevista`, `Costo`, `EstadoContrato`) VALUES
(1, 363, 3, '2025-04-25', '2026-04-25', 122000.00, 'Cancelado'),
(2, 356, 1, '2025-04-22', '2026-04-22', 64000.00, 'Vigente'),
(3, 12, 2, '2025-02-10', '2026-02-10', 113000.00, 'Vigente'),
(4, 378, 1, '2025-05-19', '2026-05-19', 65500.00, 'Vigente'),
(5, 328, 1, '2025-03-28', '2026-03-28', 60000.00, 'Vencido'),
(6, 374, 3, '2025-05-10', '2026-05-10', 139000.00, 'Vigente'),
(7, 20, 2, '2025-02-26', '2026-02-26', 111500.00, 'Vigente'),
(8, 21, 1, '2025-02-27', '2026-02-27', 70500.00, 'Vigente'),
(9, 318, 3, '2025-03-16', '2026-03-16', 148500.00, 'Cancelado'),
(10, 13, 2, '2025-02-11', '2026-02-11', 113500.00, 'Vigente'),
(11, 322, 2, '2025-03-24', '2026-03-24', 102500.00, 'Vigente'),
(12, 354, 2, '2025-04-24', '2026-04-24', 90500.00, 'Vigente'),
(13, 384, 2, '2026-05-27', '2027-05-27', 95500.00, 'Vigente'),
(14, 30, 2, '2025-03-05', '2026-03-05', 94500.00, 'Vigente'),
(15, 314, 3, '2025-03-08', '2026-03-08', 180000.00, 'Vigente'),
(16, 360, 1, '2025-04-29', '2026-04-29', 74500.00, 'Vigente'),
(17, 339, 3, '2025-04-06', '2026-04-06', 143500.00, 'Vencido'),
(18, 17, 1, '2025-02-22', '2026-02-22', 70500.00, 'Vigente'),
(19, 7, 1, '2025-01-27', '2026-01-27', 75000.00, 'Vigente'),
(20, 2, 1, '2025-01-19', '2026-01-19', 55000.00, 'Vigente'),
(21, 320, 3, '2025-03-14', '2026-03-14', 169000.00, 'Vigente'),
(22, 345, 1, '2025-04-12', '2026-04-12', 68000.00, 'Cancelado'),
(23, 324, 2, '2025-03-18', '2026-03-18', 77000.00, 'Cancelado'),
(24, 26, 1, '2025-03-06', '2026-03-06', 63000.00, 'Vigente'),
(25, 332, 2, '2025-03-28', '2026-03-28', 79500.00, 'Vencido'),
(26, 15, 1, '2025-02-14', '2026-02-14', 56000.00, 'Vigente'),
(27, 366, 1, '2025-05-01', '2026-05-01', 56000.00, 'Vencido'),
(28, 358, 1, '2025-04-28', '2026-04-28', 67500.00, 'Vigente'),
(29, 321, 1, '2025-03-19', '2026-03-19', 70500.00, 'Vigente'),
(30, 338, 2, '2025-04-04', '2026-04-04', 114000.00, 'Vigente'),
(31, 367, 2, '2025-05-05', '2026-05-05', 114500.00, 'Vigente'),
(32, 16, 1, '2025-02-17', '2026-02-17', 62000.00, 'Vigente'),
(33, 25, 1, '2025-02-27', '2026-02-27', 67500.00, 'Vigente'),
(34, 340, 1, '2025-04-03', '2026-04-03', 63500.00, 'Vigente'),
(35, 372, 3, '2025-05-11', '2026-05-11', 163500.00, 'Vigente'),
(36, 325, 2, '2025-03-20', '2026-03-20', 78000.00, 'Vigente'),
(37, 327, 1, '2025-03-26', '2026-03-26', 60500.00, 'Vigente'),
(38, 337, 1, '2025-04-04', '2026-04-04', 70000.00, 'Vigente'),
(39, 341, 2, '2025-04-03', '2026-04-03', 93000.00, 'Vigente'),
(40, 351, 2, '2025-04-22', '2026-04-22', 78500.00, 'Vigente'),
(41, 362, 3, '2025-05-03', '2026-05-03', 150000.00, 'Vigente'),
(42, 323, 1, '2025-03-20', '2026-03-20', 72500.00, 'Vigente'),
(43, 333, 1, '2025-03-30', '2026-03-30', 68500.00, 'Vigente'),
(44, 336, 2, '2025-03-31', '2026-03-31', 119000.00, 'Vigente'),
(45, 368, 2, '2025-05-03', '2026-05-03', 80500.00, 'Vigente'),
(46, 8, 2, '2025-02-04', '2026-02-04', 79500.00, 'Vigente'),
(47, 361, 1, '2025-04-24', '2026-04-24', 65000.00, 'Vigente'),
(48, 315, 1, '2025-03-13', '2026-03-13', 72500.00, 'Vigente'),
(49, 344, 3, '2025-04-07', '2026-04-07', 170000.00, 'Vigente'),
(50, 353, 1, '2025-04-23', '2026-04-23', 71500.00, 'Vencido'),
(51, 4, 1, '2025-01-19', '2026-01-19', 62000.00, 'Vigente'),
(52, 14, 3, '2025-02-13', '2026-02-13', 123000.00, 'Vencido'),
(53, 330, 3, '2025-04-01', '2026-04-01', 107500.00, 'Vencido'),
(54, 379, 3, '2025-05-12', '2026-05-12', 143500.00, 'Vigente'),
(55, 346, 1, '2025-04-17', '2026-04-17', 66000.00, 'Vigente'),
(56, 312, 2, '2025-03-13', '2026-03-13', 86000.00, 'Vencido'),
(57, 23, 1, '2025-02-23', '2026-02-23', 69000.00, 'Vigente'),
(58, 317, 2, '2025-03-16', '2026-03-16', 86000.00, 'Vencido'),
(59, 342, 3, '2025-04-08', '2026-04-08', 145000.00, 'Vigente'),
(60, 319, 1, '2025-03-21', '2026-03-21', 71000.00, 'Cancelado'),
(61, 11, 2, '2025-02-03', '2026-02-03', 114500.00, 'Vigente'),
(62, 10, 1, '2025-02-02', '2026-02-02', 57000.00, 'Vigente'),
(63, 377, 3, '2025-05-18', '2026-05-18', 146000.00, 'Vigente'),
(64, 316, 1, '2025-03-08', '2026-03-08', 65500.00, 'Vigente'),
(65, 331, 1, '2025-03-24', '2026-03-24', 58500.00, 'Vigente'),
(66, 364, 1, '2025-05-03', '2026-05-03', 71000.00, 'Vigente'),
(67, 27, 3, '2025-03-02', '2026-03-02', 174000.00, 'Vigente'),
(68, 370, 2, '2025-05-05', '2026-05-05', 113500.00, 'Vigente'),
(69, 18, 1, '2025-02-15', '2026-02-15', 63000.00, 'Vigente'),
(70, 3, 3, '2025-01-23', '2026-01-23', 127500.00, 'Vigente'),
(71, 29, 2, '2025-03-05', '2026-03-05', 97500.00, 'Vencido'),
(72, 352, 1, '2025-04-19', '2026-04-19', 68000.00, 'Vencido'),
(73, 359, 2, '2025-04-24', '2026-04-24', 89000.00, 'Vigente'),
(74, 326, 2, '2025-03-25', '2026-03-25', 98500.00, 'Vigente'),
(75, 355, 2, '2025-04-22', '2026-04-22', 88000.00, 'Vencido'),
(76, 380, 2, '2025-05-21', '2026-05-21', 93000.00, 'Vigente'),
(77, 371, 2, '2025-05-11', '2026-05-11', 95000.00, 'Vigente'),
(78, 376, 1, '2025-05-10', '2026-05-10', 71000.00, 'Vigente'),
(79, 335, 1, '2025-04-01', '2026-04-01', 61500.00, 'Vigente'),
(80, 373, 2, '2025-05-05', '2026-05-05', 95500.00, 'Vigente'),
(81, 375, 3, '2025-05-13', '2026-05-13', 105000.00, 'Vigente'),
(82, 347, 2, '2025-04-14', '2026-04-14', 95000.00, 'Vencido'),
(83, 350, 2, '2025-04-12', '2026-04-12', 91500.00, 'Vigente'),
(84, 365, 1, '2025-05-05', '2026-05-05', 69500.00, 'Cancelado'),
(85, 348, 3, '2025-04-15', '2026-04-15', 139000.00, 'Cancelado'),
(86, 22, 1, '2025-03-01', '2026-03-01', 55500.00, 'Vigente'),
(87, 24, 2, '2025-02-25', '2026-02-25', 83000.00, 'Cancelado'),
(88, 343, 3, '2025-04-12', '2026-04-12', 146500.00, 'Vigente'),
(89, 9, 1, '2025-02-04', '2026-02-04', 65500.00, 'Vigente'),
(90, 349, 2, '2025-04-15', '2026-04-15', 88000.00, 'Vigente');

-- --------------------------------------------------------

--
-- Table structure for table `PRESUPUESTOS`
--

CREATE TABLE `PRESUPUESTOS` (
  `ID_Presupuesto` int NOT NULL,
  `NroPresupuesto` varchar(50) NOT NULL,
  `TipoTrabajo` enum('Instalacion Nuevo Cliente','Ampliacion Cliente Existente') NOT NULL,
  `ID_Abonado` int DEFAULT NULL,
  `Direccion` varchar(255) NOT NULL,
  `Ciudad` varchar(100) NOT NULL,
  `FechaRecepcion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Estado` enum('Pendiente','Coordinado') DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `PRESUPUESTOS`
--

INSERT INTO `PRESUPUESTOS` (`ID_Presupuesto`, `NroPresupuesto`, `TipoTrabajo`, `ID_Abonado`, `Direccion`, `Ciudad`, `FechaRecepcion`, `Estado`) VALUES
(1, 'PR-2026-0200', 'Instalacion Nuevo Cliente', NULL, 'Av. Juan B. Justo 4520', 'Buenos Aires', '2026-07-04 21:56:28', 'Pendiente'),
(3, 'PR-2026-0210', 'Instalacion Nuevo Cliente', NULL, 'Acevedo 500', 'Buenos Aires', '2026-07-04 22:12:12', 'Coordinado');

-- --------------------------------------------------------

--
-- Table structure for table `REPUESTOS_OT`
--

CREATE TABLE `REPUESTOS_OT` (
  `ID_RepuestoOT` int NOT NULL,
  `ID_Asignacion` int NOT NULL,
  `ID_Modelo` int NOT NULL,
  `NumeroSerieUsado` varchar(100) DEFAULT NULL,
  `Cantidad` int NOT NULL DEFAULT '1',
  `TipoMovimiento` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ROLES`
--

CREATE TABLE `ROLES` (
  `ID_Rol` int NOT NULL,
  `NombreRol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ROLES`
--

INSERT INTO `ROLES` (`ID_Rol`, `NombreRol`) VALUES
(1, 'Administrador'),
(13, 'Atención al Cliente'),
(6, 'Auditor de Calidad'),
(3, 'Coordinador Técnico'),
(10, 'Despacho de Unidades'),
(2, 'Gerente de Operaciones'),
(7, 'Ingeniero de IT'),
(5, 'Jefe Monitoreo'),
(4, 'Jefe Técnico'),
(9, 'Operario de Monitoreo'),
(11, 'Personal de Respuesta'),
(12, 'Personal de Ventas'),
(14, 'Recursos Humanos'),
(8, 'Técnico');

-- --------------------------------------------------------

--
-- Table structure for table `SECTORES`
--

CREATE TABLE `SECTORES` (
  `ID_Sector` int NOT NULL,
  `NombreSector` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `SECTORES`
--

INSERT INTO `SECTORES` (`ID_Sector`, `NombreSector`) VALUES
(6, 'Comercial'),
(1, 'Dirección General'),
(3, 'Infraestructura e IT'),
(4, 'Monitoreo'),
(2, 'Operaciones'),
(7, 'Recursos Humanos'),
(5, 'Técnica y Campo');

-- --------------------------------------------------------

--
-- Table structure for table `SEGUIMIENTOS_EVENTOS`
--

CREATE TABLE `SEGUIMIENTOS_EVENTOS` (
  `ID_Seguimiento` int NOT NULL,
  `ID_Evento` int NOT NULL,
  `ID_Operador` int NOT NULL,
  `FechaHoraAccion` datetime DEFAULT CURRENT_TIMESTAMP,
  `AccionRealizada` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SERVICIOS_BASE`
--

CREATE TABLE `SERVICIOS_BASE` (
  `ID_ServicioBase` int NOT NULL,
  `NombreServicio` varchar(100) NOT NULL,
  `Descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `SERVICIOS_BASE`
--

INSERT INTO `SERVICIOS_BASE` (`ID_ServicioBase`, `NombreServicio`, `Descripcion`) VALUES
(1, 'Monitoreo 24hs Residencial', 'Monitoreo 24hs Residencial — datos de prueba'),
(2, 'Monitoreo 24hs Comercial', 'Monitoreo 24hs Comercial — datos de prueba'),
(3, 'Monitoreo + Rondines de Vigilancia', 'Monitoreo + Rondines de Vigilancia — datos de prueba');

-- --------------------------------------------------------

--
-- Table structure for table `STOCK`
--

CREATE TABLE `STOCK` (
  `ID_Stock` int NOT NULL,
  `ID_Modelo` int NOT NULL,
  `Cantidad` int NOT NULL,
  `UbicacionFisica` varchar(50) DEFAULT NULL,
  `FechaUltimaActualizacion` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TICKETS_SOPORTE`
--

CREATE TABLE `TICKETS_SOPORTE` (
  `ID_Ticket` int NOT NULL,
  `ID_Abonado` int NOT NULL,
  `ID_AgenteDAC` int NOT NULL,
  `FechaCreacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `Asunto` varchar(150) NOT NULL,
  `Descripcion` text,
  `Estado` varchar(20) NOT NULL DEFAULT 'Abierto',
  `Prioridad` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `USUARIOS`
--

CREATE TABLE `USUARIOS` (
  `ID_Usuario` int NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Email` varchar(150) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  `ID_Sector` int NOT NULL,
  `ID_Rol` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `USUARIOS`
--

INSERT INTO `USUARIOS` (`ID_Usuario`, `Nombre`, `Email`, `PasswordHash`, `Telefono`, `Activo`, `ID_Sector`, `ID_Rol`) VALUES
(1, 'Andres Bertolin', 'abertolin@optimus.com', '$2b$10$zgUxuBpX9H3cXUqyn3R2Ou8iVSklUf5/0bwVNxuXd5ActTONBUxjW', '11-4588-2026', 1, 1, 1),
(2, 'Carlos Gonzalez', 'cgonzalez@optimus.com', '$2b$10$a2Ycr60MYo.nE8Ln3yvNJ.kV13KoF7y6Xal2u0QWSaI0uqKuLsTze', '11-5422-9831', 1, 1, 2),
(3, 'Elena Rodriguez', 'erodriguez@optimus.com', '$2b$10$W8KWVtGh4nJ5MV1btFxsLurnaar6yzgAO46cpdvZYNvAWEUljqFWO', '11-3344-5566', 1, 1, 2),
(4, 'Marta Lopez', 'mlopez@optimus.com', '$2b$10$CfMTryeoTWv5FSnBzEe.aOhm48hnNX098QtkGGM46ucpa0bpvdiAG', '11-6677-8899', 1, 2, 6),
(5, 'Jorge Garcia', 'jgarcia@optimus.com', '$2b$10$zUlFcYPB7iagdj4VElxcQO.5Rs3tT/ayvArzGnzxMY6BJu0suFjj6', '11-2211-4433', 1, 2, 6),
(6, 'Kevin Martinez', 'kmartinez@optimus.com', '$2b$10$3hXQAOQmQ3KxboKfWxWjHO78w7rXbLFv/XP3goxXttShxJdHI3UQi', '11-5500-1122', 1, 3, 7),
(7, 'Walter Perez', 'wperez@optimus.com', '$2b$10$Ywr2vnf2zeQJUDsOPeNobey7rLN51/rqkKMfvV9v6Bl/76jYQZbmu', '11-9988-7766', 1, 3, 7),
(8, 'Bryan Sanchez', 'bsanchez@optimus.com', '$2b$10$W6/2ZVPNKjJvxLkJLBfjiOeNRcm.UvpwYzc9J/Wr7aNh873Rmh/ge', '11-4433-2211', 1, 3, 7),
(9, 'Marcos Romero', 'mromero@optimus.com', '$2b$10$J2ud2DYVU0zB8UFo/PYwW.2FMjs09Gg80JTfdv5LigRaADycLy5Te', '11-7788-9900', 1, 3, 3),
(10, 'Julia Diaz', 'jdiaz@optimus.com', '$2b$10$53HseUt9GzlVHZatzzEAEOpqUEnhdoxbZgIxd.g63mxHgheo6DFT6', '11-1122-3344', 1, 3, 3),
(11, 'Roberto Sosa', 'rsosa@optimus.com', '$2b$10$rmN0gqexOCrlEds5Dz/ROufPj4.TrX3Vu0t7D545x5uICL2g.lecO', '11-5544-3322', 1, 3, 3),
(12, 'Leo Navarro', 'lnavarro@optimus.com', '$2b$10$syKcIs9bM9Jqr5Hms.Qx0O0yeRHQfwlP4uqzq9hWlOxB34E8ghRj6', '11-6655-4433', 1, 3, 7),
(13, 'Guido Saavedra', 'gsaavedra@optimus.com', '$2b$10$5uI33/CLTqQTSFBjRT.YlOaDQpE5L/HhytyxjwvYltZdkzl784naO', '11-2233-4455', 1, 3, 7),
(15, 'Hugo Molina', 'hmolina@optimus.com', '$2b$10$aFSkGZBzjSMODCIkwqhD6OqdXtDc2sdzLxYbt1bft1NJ9Vz3eNcyu', '11-3322-1100', 1, 5, 4),
(16, 'Hugo Alvarez', 'halvarez@optimus.com', '$2b$10$rWpZlKOsjxY3nnuA079w1eyOnk1SfhAhCkoGDbbhGdgXu906NNXUm', '11-4567-1234', 1, 5, 4),
(17, 'Fabian Benitez', 'fbenitez@optimus.com', '$2b$10$y4j3Ry3Ug0gpNYTnaaydcO.4AjQzGri6eeDUo5pzmpF1X5hcg8/NK', '11-5678-2345', 1, 5, 4),
(18, 'Beatriz Torres', 'btorres@optimus.com', '$2b$10$FCISDOfSAoZt9D/JGYeJAuYo8GDtGjkjkE52F9XMm7KUug2yjGMhy', '11-6789-3456', 1, 4, 5),
(19, 'Sergio Ruiz', 'sruiz@optimus.com', '$2b$10$50Muly21Nq37K7xyOCoJ2.i.YAI56SqD4L1wUj8jHQ7QUP5PvIvQq', '11-7890-4567', 1, 4, 5),
(20, 'Oscar Blindaje', 'oblindaje@optimus.com', '$2b$10$QXMKYUQCej5ZPRs1wdYhcevwWeA1kTt9JYhnk0d.9BcGpdE0f6wOu', '11-8901-5678', 1, 5, 4),
(21, 'Juan Flores', 'jflores@optimus.com', '$2b$10$GxYajRBfITqEYkq5dfXX5uzrZ/gNkyYBoQQe0E3T6OLKUTKIYyE1.', '11-2121-3434', 1, 5, 8),
(22, 'Pedro Acosta', 'pacosta@optimus.com', '$2b$10$VBJXA3IbwgWeoCHj0EnncuKAOER9mCMc3nLX/9iX3ViT6fFqthSzG', '11-2233-4455', 1, 5, 8),
(23, 'Luis Silva', 'lsilva@optimus.com', '$2b$10$0p2202Jhi3CQ0vTGRIBGZOtXT.RrLMzXrEDEIS2RFIf4IB4qtQJmq', '11-3344-5566', 1, 5, 8),
(24, 'Ana Pereyra', 'apereyra@optimus.com', '$2b$10$QM/ykwg1YbOspU1ECxwbxueKuL5ltNZzCryVfLG8I1VI6cKq.K.Xq', '11-4455-6677', 1, 5, 8),
(25, 'Sofia Morales', 'smorales@optimus.com', '$2b$10$wbLpxWJxsD29preQr0tcueq52jQce55MbzHIK5K89eKYzH0W5IoNO', '11-5566-7788', 1, 5, 8),
(26, 'Diego Quintana', 'dquintana@optimus.com', '$2b$10$Yz.V2gNukfCspTJV8/8nZ.Xe3HAhkaQuQEB8mb0kA/5jFPiqrhQ3m', '11-6677-8899', 1, 5, 8),
(27, 'Maria Castro', 'mcastro@optimus.com', '$2b$10$zKa5zXRyLhqH/5ggcTDT2uij8jxmNtK5XCUy9/L4WDr1m1V4geQvG', '11-7788-9900', 1, 5, 8),
(28, 'Jose Suarez', 'jsuarez@optimus.com', '$2b$10$InEHBQZ6AZuZIopX6BNEn.8UnMj8ggWtQkmopZUp5leoTdw1NL3fC', '11-8899-0011', 1, 5, 8),
(29, 'Laura Medina', 'lmedina@optimus.com', '$2b$10$X7/THs5s.0pfQe4tJCZHDeiNXrYDKA8/NeaBNqfWEDiQNR8EceY0m', '11-9900-1122', 1, 5, 8),
(30, 'Jorge Aguirre', 'jaguirre@optimus.com', '$2b$10$sRgN7P2pz40pdKpINWN5vu5KivguHDQKTUZo5ZfIbJ5giLv0mnJqm', '11-0011-2233', 1, 5, 8),
(31, 'Rosa Blanco', 'rblanco@optimus.com', '$2b$10$b.4xkLfi5RiQwe1/7zovfuRKZMNgL.0OeGWFEuO4xnEYPEJf7khya', '11-1234-5678', 1, 5, 8),
(32, 'Oscar Gimenez', 'ogimenez@optimus.com', '$2b$10$7B6U3c6Snw6nujsdIB547Obe07VXGprxKbNQcCnS0H4u7gabFUHzi', '11-2345-6789', 1, 5, 8),
(33, 'Marta Rossi', 'mrossi@optimus.com', '$2b$10$1TnqwyRmuQkn5WVMOG0HQOMppM4oC9BaCE2vtge0I7mcZGi4J1FX.', '11-3456-7890', 1, 5, 8),
(34, 'Raul Ferrari', 'rferrari@optimus.com', '$2b$10$z13vtREHDva8SmYd0Td2bu62NUhs0oSNUmy1hvJ8S4QdNsMr0qYqq', '11-4567-8901', 1, 5, 8),
(35, 'Felix Ledesma', 'fledesma@optimus.com', '$2b$10$z7WuKyD3j.IkZ6oVz7qBXuKRsZBYaIc48emlxLAOdIYuGQ4RC5fFC', '11-5678-9012', 1, 5, 8),
(36, 'Ivan Ortiz', 'iortiz@optimus.com', '$2b$10$em1c.cNP9yxcaM3sve57mOORHxt4n9Dlor5qLJcg7NuHYfBvhAbky', '11-6789-0123', 1, 5, 8),
(37, 'Nora Gil', 'ngil@optimus.com', '$2b$10$AVpq/pHfdx5HQ8r3B3lkNu9qcCpMGRDipJ/QoGwOAFgRh.YwjHXJW', '11-7890-1234', 1, 5, 8),
(38, 'Omar Herrera', 'oherrera@optimus.com', '$2b$10$CHFpweB8ksM58FinIHUMwuZzUCL8SzaFSmgnRaf/xn/HTkwBgUdKy', '11-8901-2345', 1, 5, 8),
(39, 'Paula Mendez', 'pmendez@optimus.com', '$2b$10$HCkVTzTOHKtW9U5ou3KFTedl5hmGY.Qr.HVnu4j0MbltSo4jTYO5e', '11-9012-3456', 1, 5, 8),
(40, 'Tadeo Vera', 'tvera@optimus.com', '$2b$10$zZDmruxXdGChYzBJWHyREugZwfCDSyOTJJDhx2NZ0nOjrUc03Rlpq', '11-0123-4567', 1, 5, 8),
(41, 'Lucas Medina', 'lumedina@optimus.com', '$2b$10$YyJbG4ivt.M0W4l0KDhh2.EWi/T103BHOZav8MMk.UlUtVRz4x18m', '11-1357-2468', 1, 5, 8),
(42, 'Enzo Ferrari', 'eferrari@optimus.com', '$2b$10$bh82XNJ.0nWkTxl/MgDpWO9TJs/3Y1tvmMigospnF.f4FfKSZR14u', '11-2468-1357', 1, 5, 8),
(43, 'Dante Alighieri', 'dalighieri@optimus.com', '$2b$10$cEU2WhHu13R//OOAB/b0n.xAeoZQUa3gZ7mPhkn0n7b.fUZl1orP6', '11-9876-5432', 1, 5, 8),
(44, 'Gino Renni', 'grenni@optimus.com', '$2b$10$aXnXkLW1q1ErnsB9sP.Es.CBkgkF8DvbfPz12IjYK/HQ5iaHUOlI2', '11-8765-4321', 1, 5, 8),
(45, 'Esteban Quito', 'equito@optimus.com', '$2b$10$yKNcPlQsRp5225ledZ1Qme2jOUPY2eTBft1NNAutUaBcBtLdnCidK', '11-7654-3210', 1, 5, 8),
(46, 'Bruno Guzman', 'bguzman@optimus.com', '$2b$10$EoNueoyb7rp3ryL2YHN5A.vkxrc0pvxj1URR8ygoFPjsh.AycISJO', '11-4444-5555', 1, 4, 9),
(47, 'Carla Videla', 'cvidela@optimus.com', '$2b$10$PFRfSZomSXPnJbrIJLXcUOROAyubBjuGcFafjrb6EZWQFEfqgKlQy', '11-5555-6666', 1, 4, 9),
(48, 'Dante Mansilla', 'dmansilla@optimus.com', '$2b$10$mdOD2FaIZm4qgNUadD/koe246ahbiy7/QliwFDsg3ffjxTn6WG7hi', '11-6666-7777', 1, 4, 9),
(49, 'Erika Juarez', 'ejuarez@optimus.com', '$2b$10$naA7bjKGjSSZ8MrhiXweOedXFMvFI0cFTsMqmxisOVpeK2xMKK0u6', '11-7777-8888', 1, 4, 9),
(50, 'Pablo Baez', 'fbaez@optimus.com', '$2b$10$G/amVp7go97FRf/fPX/3lOUKmKTbMev6aNuzNv3Kyroxo1Iyn.k.q', '11-8888-9999', 1, 4, 9),
(51, 'Gilda Galeano', 'ggaleano@optimus.com', '$2b$10$.6kRTNwjxny3vQ./F0ecCeQKJdbmcdPXK6a7Df7Td2Gwnwm6NKvpO', '11-9999-0000', 1, 4, 9),
(52, 'Hector Peralta', 'hperalta@optimus.com', '$2b$10$ZJEz54N/QQFOu2JgkykjeeOREV5oEijI//gZsk6b1dKQ4xVvgKtLi', '11-1010-2020', 1, 4, 9),
(53, 'Iris Barraza', 'ibarraza@optimus.com', '$2b$10$yyE8TMpl.GAUTRHekjYwtefHDQpl5nib6l/UCvDkrsMLU.Y006iqu', '11-3030-4040', 1, 4, 9),
(54, 'Javier Cabrera', 'jcabrera@optimus.com', '$2b$10$y/Idiea3k63tA0ctMVfl/u19c/sP1Ntjwv7zlN2SkMvnSMikzOfGW', '11-5050-6060', 1, 4, 9),
(55, 'Karen Luque', 'kluque@optimus.com', '$2b$10$xnW9ceWmFmCQaJbVZvGG..HZfMX9ace8Uf.ua2O8IX0ndxx3soyEG', '11-7070-8080', 1, 4, 9),
(56, 'Lars Vera', 'lvera@optimus.com', '$2b$10$DhobNsQLeG8HpML9SyY/fePOG2DGPq3Lpp5/hAR.dBd4GbtBpmEjO', '11-9090-0000', 1, 4, 9),
(57, 'Mirta Cordoba', 'mcordoba@optimus.com', '$2b$10$a9ezXQH13XSEHwnAmcLJt.ioqR7r3G.ysCcPKKiTf9Plj7qSphqg2', '11-1212-3434', 1, 4, 9),
(58, 'Niel Duarte', 'nduarte@optimus.com', '$2b$10$UM.AP.jCOmVO3ggmaB2J1OnPmdyetMtT6RMzSZXptRarvYtXAuBqK', '11-2323-4545', 1, 4, 9),
(59, 'Olga Ibarra', 'oibarra@optimus.com', '$2b$10$jwgvRazShxHioD404cPSyu2ONogP3ni0.m.UqhCGqKAKcD8STUt/S', '11-3434-5656', 1, 4, 9),
(60, 'Pavel Vazquez', 'pvazquez@optimus.com', '$2b$10$lfzzYqxbl.BugJ2t4JeRjegxai7062svo9rHWA1jIxedMs.2CDrc.', '11-4545-6767', 1, 4, 9),
(61, 'Quara Espindola', 'qespindola@optimus.com', '$2b$10$9Rqob7JPJTbhE1MxoyUCf.WIW5Y6JRSj900kKi9yPQDiU8XH.pZre', '11-5656-7878', 1, 4, 9),
(62, 'Rocco Maidana', 'rmaidana@optimus.com', '$2b$10$CWhted0TXdEj8yxncuJ2s.DJQXu6HS.LKvT08q8aHRjnHjRT5Uroe', '11-6767-8989', 1, 4, 9),
(63, 'Sara Godoy', 'sgodoy@optimus.com', '$2b$10$fKUv2Bp/cLcei8gJMfIa7O/R2d7P2mZtab4YF6zVvuAITPDnO4rVG', '11-7878-9090', 1, 4, 9),
(64, 'Tito Caceres', 'tcaceres@optimus.com', '$2b$10$Pjd/Yg9R/GbJzU78gSgoLOQR6sPBaxMWrKIcxCE9MFEEOWlhVeKde', '11-8989-0101', 1, 4, 9),
(65, 'Uma Cardozo', 'ucardozo@optimus.com', '$2b$10$zbjkKHexn/TnNFhYo6kx6eTAtpoGWH./c5IIM6XBOo5u/O13zhj36', '11-9090-1212', 1, 4, 9),
(66, 'Valeria Lynch', 'vlynch@optimus.com', '$2b$10$JsGXnPI3uq4evDMzdXZ0FufBVr5elJQuJZg7jyTS8NM3XL.jZCHqa', '11-0101-2323', 1, 4, 9),
(67, 'Wilson Paim', 'wpaim@optimus.com', '$2b$10$bWLG9YA9UF3ea2Lvy7LePuoQccdBU6lDfEjRZEx2RrRgI5N6qNUP.', '11-1212-4545', 1, 4, 9),
(68, 'Ximena Baron', 'xbaron@optimus.com', '$2b$10$tUkWVV9D8ctX5m2SLKZMv.mdbdW1K8rJG66anJjrlCcLcGTZLR7sG', '11-3434-6767', 1, 4, 9),
(69, 'Yannick Noah', 'ynoah@optimus.com', '$2b$10$dMn0gMklhqWX13pKMG6umumtX1dl0XM4Tw6NXmMJ0fKwxrAWoXKwa', '11-5656-8989', 1, 4, 9),
(70, 'Zoe Gotusso', 'zgotusso@optimus.com', '$2b$10$AlCbIvCSOrxKTDMVOPYyE.fRDBoMCBEwyGOJgzWhAT8549WMDcM3O', '11-7878-0000', 1, 4, 9),
(71, 'Ricardo Avalos', 'ravalos@optimus.com', '$2b$10$BDQSjUoA0ZCiJ58rKdveBuA2sbEH4IkHXbilNrUGpCdJdhpMRiI7y', '11-4455-0011', 1, 2, 10),
(72, 'Silvia Figueroa', 'sfigueroa@optimus.com', '$2b$10$ckPlb1X5GSI6NBomJy5uZ.53HERpNGdI4fab/gO/wETkX9xDPYuZy', '11-5566-1122', 1, 2, 10),
(73, 'Tomas Luna', 'tluna@optimus.com', '$2b$10$uQ9.wt5JXcSG16.w5XW2R.x0R6Py.PUs6uQpfUn9ggPss4fSgk2Qq', '11-6677-2233', 1, 2, 10),
(74, 'Vanesa Rios', 'vrios@optimus.com', '$2b$10$5./S2EhgLHnszmyWxmnxVuQSmfhmwgVBC6X3hiZcipm2wa59pHZWu', '11-7788-3344', 1, 2, 10),
(75, 'Yago Ojeda', 'yojeda@optimus.com', '$2b$10$8I6rbWqiXTtvrSmBicelkOshGf24GQaPJEzsjatx8dcsFCxd03A7a', '11-8899-4455', 1, 2, 11),
(76, 'Zulema Barrios', 'zbarrios@optimus.com', '$2b$10$dMMpucXe3p5QN0gjSA8G9eMHQE3JSF/YZ8.IKAvpktXJ0XvhFVWvi', '11-9900-5566', 1, 6, 12),
(77, 'Abel Paez', 'apaez@optimus.com', '$2b$10$QPrQ.ea7BrQ.ak/dqWrZY.7bnJEkFFr32TEKZCsrD4SY5BgfKjUNa', '11-0011-6677', 1, 6, 12),
(78, 'Belen Coronel', 'bcoronel@optimus.com', '$2b$10$W4mf3ssHdmcZdyjUAAXs2OnrUScpX5sEG2GUzLYe4H/DfnaxH6A0G', '11-1122-7788', 1, 6, 13),
(79, 'Cesar Miranda', 'cmiranda@optimus.com', '$2b$10$ZyZZmydgX3vm.MnRSTDcjO7qnbNsNReFtxjXd4iHRUSWbRq1abmGK', '11-2233-8899', 1, 6, 13),
(80, 'Enzo Bravo', 'ebravo@optimus.com', '$2b$10$/tGEb7OLafrKXrP1wClxEerhtrbUR2yNr/4rjCC.PboZByP8ANWdS', '11-3344-9900', 1, 7, 14),
(81, 'Carmen Sofia Contreras ', 'Scontreras@optimus.com', '$2b$10$4R2OlYGuegewo1x522d0ZuOWtxXuPVMkLAZH/hd5tsvxcL8uD33re', '11-2383-7645', 0, 7, 14),
(82, 'Liliana Alvarez', 'lialvarez@optimus.com', '$2b$10$lhGcWsTfnApjoLGDcQyTnu8S1xYt5RtcQ12u09avJ9GXOwEGqvFWG', '11-3773-9442', 1, 1, 1),
(85, 'Julian Campos ', 'jcampos@optimus.com', '$2b$10$dfaPIeiKMbml0oVsJjMvNebS0y3BiMqhCuK.2uBTqZsZt2zO7r.UO', '11-2398-0076', 1, 7, 14);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ABONADOS`
--
ALTER TABLE `ABONADOS`
  ADD PRIMARY KEY (`ID_Abonado`),
  ADD UNIQUE KEY `RUT` (`RUT`),
  ADD KEY `idx_nro_abonado` (`NumeroDeAbonado`);

--
-- Indexes for table `ASIGNACIONES`
--
ALTER TABLE `ASIGNACIONES`
  ADD PRIMARY KEY (`ID_Asignacion`),
  ADD KEY `FK_Asignacion_Direccion` (`ID_Direccion`),
  ADD KEY `FK_Asignacion_Tecnico` (`ID_Tecnico`);

--
-- Indexes for table `CODIGOS_EVENTOS`
--
ALTER TABLE `CODIGOS_EVENTOS`
  ADD PRIMARY KEY (`ID_CodigoEvento`),
  ADD UNIQUE KEY `Codigo` (`Codigo`);

--
-- Indexes for table `COTIZACIONES`
--
ALTER TABLE `COTIZACIONES`
  ADD PRIMARY KEY (`ID_Cotizacion`),
  ADD KEY `FK_Cotizacion_Vendedor` (`ID_Vendedor`);

--
-- Indexes for table `DIRECCIONES`
--
ALTER TABLE `DIRECCIONES`
  ADD PRIMARY KEY (`ID_Direccion`),
  ADD KEY `FK_Direccion_Abonado` (`ID_Abonado`);

--
-- Indexes for table `DISPOSITIVOS`
--
ALTER TABLE `DISPOSITIVOS`
  ADD PRIMARY KEY (`ID_Dispositivo`),
  ADD UNIQUE KEY `NumeroSerie` (`NumeroSerie`),
  ADD KEY `FK_Dispositivo_Direccion` (`ID_Direccion`),
  ADD KEY `FK_Dispositivo_Modelo` (`ID_Modelo`);

--
-- Indexes for table `EVENTOS`
--
ALTER TABLE `EVENTOS`
  ADD PRIMARY KEY (`ID_Evento`),
  ADD KEY `FK_Evento_Dispositivo` (`ID_Dispositivo`),
  ADD KEY `FK_Evento_Codigo` (`ID_CodigoEvento`);

--
-- Indexes for table `MODELOS_DISPOSITIVOS`
--
ALTER TABLE `MODELOS_DISPOSITIVOS`
  ADD PRIMARY KEY (`ID_Modelo`),
  ADD UNIQUE KEY `NombreModelo` (`NombreModelo`);

--
-- Indexes for table `PLANES_CONTRATADOS`
--
ALTER TABLE `PLANES_CONTRATADOS`
  ADD PRIMARY KEY (`ID_PlanContratado`),
  ADD KEY `FK_Plan_Abonado` (`ID_Abonado`),
  ADD KEY `FK_Plan_ServicioBase` (`ID_ServicioBase`);

--
-- Indexes for table `PRESUPUESTOS`
--
ALTER TABLE `PRESUPUESTOS`
  ADD PRIMARY KEY (`ID_Presupuesto`),
  ADD UNIQUE KEY `NroPresupuesto` (`NroPresupuesto`),
  ADD KEY `ID_Abonado` (`ID_Abonado`);

--
-- Indexes for table `REPUESTOS_OT`
--
ALTER TABLE `REPUESTOS_OT`
  ADD PRIMARY KEY (`ID_RepuestoOT`),
  ADD KEY `FK_RepuestoOT_Asignacion` (`ID_Asignacion`),
  ADD KEY `FK_RepuestoOT_Modelo` (`ID_Modelo`);

--
-- Indexes for table `ROLES`
--
ALTER TABLE `ROLES`
  ADD PRIMARY KEY (`ID_Rol`),
  ADD UNIQUE KEY `NombreRol` (`NombreRol`);

--
-- Indexes for table `SECTORES`
--
ALTER TABLE `SECTORES`
  ADD PRIMARY KEY (`ID_Sector`),
  ADD UNIQUE KEY `NombreSector` (`NombreSector`);

--
-- Indexes for table `SEGUIMIENTOS_EVENTOS`
--
ALTER TABLE `SEGUIMIENTOS_EVENTOS`
  ADD PRIMARY KEY (`ID_Seguimiento`),
  ADD KEY `FK_Seguimiento_Evento` (`ID_Evento`),
  ADD KEY `FK_Seguimiento_Operador` (`ID_Operador`);

--
-- Indexes for table `SERVICIOS_BASE`
--
ALTER TABLE `SERVICIOS_BASE`
  ADD PRIMARY KEY (`ID_ServicioBase`),
  ADD UNIQUE KEY `NombreServicio` (`NombreServicio`);

--
-- Indexes for table `STOCK`
--
ALTER TABLE `STOCK`
  ADD PRIMARY KEY (`ID_Stock`),
  ADD KEY `FK_Stock_Modelo` (`ID_Modelo`);

--
-- Indexes for table `TICKETS_SOPORTE`
--
ALTER TABLE `TICKETS_SOPORTE`
  ADD PRIMARY KEY (`ID_Ticket`),
  ADD KEY `FK_Ticket_Abonado` (`ID_Abonado`),
  ADD KEY `FK_Ticket_Agente` (`ID_AgenteDAC`);

--
-- Indexes for table `USUARIOS`
--
ALTER TABLE `USUARIOS`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `FK_Usuario_Sector` (`ID_Sector`),
  ADD KEY `FK_Usuario_Rol` (`ID_Rol`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ABONADOS`
--
ALTER TABLE `ABONADOS`
  MODIFY `ID_Abonado` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=389;

--
-- AUTO_INCREMENT for table `ASIGNACIONES`
--
ALTER TABLE `ASIGNACIONES`
  MODIFY `ID_Asignacion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

--
-- AUTO_INCREMENT for table `CODIGOS_EVENTOS`
--
ALTER TABLE `CODIGOS_EVENTOS`
  MODIFY `ID_CodigoEvento` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `COTIZACIONES`
--
ALTER TABLE `COTIZACIONES`
  MODIFY `ID_Cotizacion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `DIRECCIONES`
--
ALTER TABLE `DIRECCIONES`
  MODIFY `ID_Direccion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `DISPOSITIVOS`
--
ALTER TABLE `DISPOSITIVOS`
  MODIFY `ID_Dispositivo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `EVENTOS`
--
ALTER TABLE `EVENTOS`
  MODIFY `ID_Evento` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=678;

--
-- AUTO_INCREMENT for table `MODELOS_DISPOSITIVOS`
--
ALTER TABLE `MODELOS_DISPOSITIVOS`
  MODIFY `ID_Modelo` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `PLANES_CONTRATADOS`
--
ALTER TABLE `PLANES_CONTRATADOS`
  MODIFY `ID_PlanContratado` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `PRESUPUESTOS`
--
ALTER TABLE `PRESUPUESTOS`
  MODIFY `ID_Presupuesto` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `REPUESTOS_OT`
--
ALTER TABLE `REPUESTOS_OT`
  MODIFY `ID_RepuestoOT` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ROLES`
--
ALTER TABLE `ROLES`
  MODIFY `ID_Rol` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `SECTORES`
--
ALTER TABLE `SECTORES`
  MODIFY `ID_Sector` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `SEGUIMIENTOS_EVENTOS`
--
ALTER TABLE `SEGUIMIENTOS_EVENTOS`
  MODIFY `ID_Seguimiento` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `SERVICIOS_BASE`
--
ALTER TABLE `SERVICIOS_BASE`
  MODIFY `ID_ServicioBase` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `STOCK`
--
ALTER TABLE `STOCK`
  MODIFY `ID_Stock` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `TICKETS_SOPORTE`
--
ALTER TABLE `TICKETS_SOPORTE`
  MODIFY `ID_Ticket` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `USUARIOS`
--
ALTER TABLE `USUARIOS`
  MODIFY `ID_Usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ASIGNACIONES`
--
ALTER TABLE `ASIGNACIONES`
  ADD CONSTRAINT `FK_Asignacion_Direccion` FOREIGN KEY (`ID_Direccion`) REFERENCES `DIRECCIONES` (`ID_Direccion`),
  ADD CONSTRAINT `FK_Asignacion_Tecnico` FOREIGN KEY (`ID_Tecnico`) REFERENCES `USUARIOS` (`ID_Usuario`);

--
-- Constraints for table `COTIZACIONES`
--
ALTER TABLE `COTIZACIONES`
  ADD CONSTRAINT `FK_Cotizacion_Vendedor` FOREIGN KEY (`ID_Vendedor`) REFERENCES `USUARIOS` (`ID_Usuario`);

--
-- Constraints for table `DIRECCIONES`
--
ALTER TABLE `DIRECCIONES`
  ADD CONSTRAINT `FK_Direccion_Abonado` FOREIGN KEY (`ID_Abonado`) REFERENCES `ABONADOS` (`ID_Abonado`);

--
-- Constraints for table `DISPOSITIVOS`
--
ALTER TABLE `DISPOSITIVOS`
  ADD CONSTRAINT `FK_Dispositivo_Direccion` FOREIGN KEY (`ID_Direccion`) REFERENCES `DIRECCIONES` (`ID_Direccion`),
  ADD CONSTRAINT `FK_Dispositivo_Modelo` FOREIGN KEY (`ID_Modelo`) REFERENCES `MODELOS_DISPOSITIVOS` (`ID_Modelo`);

--
-- Constraints for table `EVENTOS`
--
ALTER TABLE `EVENTOS`
  ADD CONSTRAINT `FK_Evento_Codigo` FOREIGN KEY (`ID_CodigoEvento`) REFERENCES `CODIGOS_EVENTOS` (`ID_CodigoEvento`),
  ADD CONSTRAINT `FK_Evento_Dispositivo` FOREIGN KEY (`ID_Dispositivo`) REFERENCES `DISPOSITIVOS` (`ID_Dispositivo`);

--
-- Constraints for table `PLANES_CONTRATADOS`
--
ALTER TABLE `PLANES_CONTRATADOS`
  ADD CONSTRAINT `FK_Plan_Abonado` FOREIGN KEY (`ID_Abonado`) REFERENCES `ABONADOS` (`ID_Abonado`),
  ADD CONSTRAINT `FK_Plan_ServicioBase` FOREIGN KEY (`ID_ServicioBase`) REFERENCES `SERVICIOS_BASE` (`ID_ServicioBase`);

--
-- Constraints for table `PRESUPUESTOS`
--
ALTER TABLE `PRESUPUESTOS`
  ADD CONSTRAINT `PRESUPUESTOS_ibfk_1` FOREIGN KEY (`ID_Abonado`) REFERENCES `ABONADOS` (`ID_Abonado`) ON DELETE SET NULL;

--
-- Constraints for table `REPUESTOS_OT`
--
ALTER TABLE `REPUESTOS_OT`
  ADD CONSTRAINT `FK_RepuestoOT_Asignacion` FOREIGN KEY (`ID_Asignacion`) REFERENCES `ASIGNACIONES` (`ID_Asignacion`),
  ADD CONSTRAINT `FK_RepuestoOT_Modelo` FOREIGN KEY (`ID_Modelo`) REFERENCES `MODELOS_DISPOSITIVOS` (`ID_Modelo`);

--
-- Constraints for table `SEGUIMIENTOS_EVENTOS`
--
ALTER TABLE `SEGUIMIENTOS_EVENTOS`
  ADD CONSTRAINT `FK_Seguimiento_Evento` FOREIGN KEY (`ID_Evento`) REFERENCES `EVENTOS` (`ID_Evento`),
  ADD CONSTRAINT `FK_Seguimiento_Operador` FOREIGN KEY (`ID_Operador`) REFERENCES `USUARIOS` (`ID_Usuario`);

--
-- Constraints for table `STOCK`
--
ALTER TABLE `STOCK`
  ADD CONSTRAINT `FK_Stock_Modelo` FOREIGN KEY (`ID_Modelo`) REFERENCES `MODELOS_DISPOSITIVOS` (`ID_Modelo`);

--
-- Constraints for table `TICKETS_SOPORTE`
--
ALTER TABLE `TICKETS_SOPORTE`
  ADD CONSTRAINT `FK_Ticket_Abonado` FOREIGN KEY (`ID_Abonado`) REFERENCES `ABONADOS` (`ID_Abonado`),
  ADD CONSTRAINT `FK_Ticket_Agente` FOREIGN KEY (`ID_AgenteDAC`) REFERENCES `USUARIOS` (`ID_Usuario`);

--
-- Constraints for table `USUARIOS`
--
ALTER TABLE `USUARIOS`
  ADD CONSTRAINT `FK_Usuario_Rol` FOREIGN KEY (`ID_Rol`) REFERENCES `ROLES` (`ID_Rol`),
  ADD CONSTRAINT `FK_Usuario_Sector` FOREIGN KEY (`ID_Sector`) REFERENCES `SECTORES` (`ID_Sector`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
