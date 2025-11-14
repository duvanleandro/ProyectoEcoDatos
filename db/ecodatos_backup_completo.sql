--
-- PostgreSQL database dump
--

\restrict ZqvDbJLERfdxfwJAEZ3RHN0RFH4n1R7uE0qqnrPQrTyBqSyLwZOQlE4ziU2uTEs

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: brigada; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.brigada (
    id integer NOT NULL,
    zona_designada character varying(100),
    nombre character varying(100),
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true
);


ALTER TABLE public.brigada OWNER TO ecodatos;

--
-- Name: brigada_id_seq; Type: SEQUENCE; Schema: public; Owner: ecodatos
--

CREATE SEQUENCE public.brigada_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brigada_id_seq OWNER TO ecodatos;

--
-- Name: brigada_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ecodatos
--

ALTER SEQUENCE public.brigada_id_seq OWNED BY public.brigada.id;


--
-- Name: brigadaconglomerado; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.brigadaconglomerado (
    id_brigada integer NOT NULL,
    id_conglomerado integer NOT NULL,
    fecha_asignacion date DEFAULT CURRENT_DATE,
    estado character varying(20) DEFAULT 'Pendiente'::character varying
);


ALTER TABLE public.brigadaconglomerado OWNER TO ecodatos;

--
-- Name: brigadaintegrante; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.brigadaintegrante (
    id_brigada integer NOT NULL,
    id_integrante integer NOT NULL
);


ALTER TABLE public.brigadaintegrante OWNER TO ecodatos;

--
-- Name: clasificaciontaxonomica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clasificaciontaxonomica (
    id integer NOT NULL,
    id_muestra integer,
    id_especie integer,
    fecha_recepcion date DEFAULT CURRENT_DATE,
    fecha_clasificacion date,
    estado character varying(20) DEFAULT 'Pendiente'::character varying,
    responsable_laboratorio character varying(100),
    notas text,
    CONSTRAINT chk_estado CHECK (((estado)::text = ANY ((ARRAY['Pendiente'::character varying, 'En_Proceso'::character varying, 'Clasificado'::character varying, 'Requiere_Revision'::character varying])::text[])))
);


ALTER TABLE public.clasificaciontaxonomica OWNER TO postgres;

--
-- Name: clasificaciontaxonomica_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clasificaciontaxonomica_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clasificaciontaxonomica_id_seq OWNER TO postgres;

--
-- Name: clasificaciontaxonomica_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clasificaciontaxonomica_id_seq OWNED BY public.clasificaciontaxonomica.id;


--
-- Name: conglomerado; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.conglomerado (
    id integer NOT NULL,
    ubicacion character varying(200),
    municipio character varying(100),
    departamento character varying(100),
    nombre character varying(100),
    latitud numeric(10,8),
    longitud numeric(11,8),
    estado character varying(20) DEFAULT 'Pendiente'::character varying,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion timestamp without time zone,
    brigada_id integer,
    brigada_nombre character varying(100),
    fecha_asignacion timestamp without time zone,
    fecha_inicio timestamp without time zone
);


ALTER TABLE public.conglomerado OWNER TO ecodatos;

--
-- Name: COLUMN conglomerado.fecha_inicio; Type: COMMENT; Schema: public; Owner: ecodatos
--

COMMENT ON COLUMN public.conglomerado.fecha_inicio IS 'Fecha y hora en que el conglomerado cambia a estado En_Proceso';


--
-- Name: conglomerado_id_seq; Type: SEQUENCE; Schema: public; Owner: ecodatos
--

CREATE SEQUENCE public.conglomerado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conglomerado_id_seq OWNER TO ecodatos;

--
-- Name: conglomerado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ecodatos
--

ALTER SEQUENCE public.conglomerado_id_seq OWNED BY public.conglomerado.id;


--
-- Name: conglomeradoindicador; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.conglomeradoindicador (
    id_conglomerado integer NOT NULL,
    id_indicador integer NOT NULL
);


ALTER TABLE public.conglomeradoindicador OWNER TO ecodatos;

--
-- Name: conglomeradosubparcela; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.conglomeradosubparcela (
    id_conglomerado integer NOT NULL,
    id_subparcela integer NOT NULL
);


ALTER TABLE public.conglomeradosubparcela OWNER TO ecodatos;

--
-- Name: especie; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.especie (
    id integer NOT NULL,
    nombre_cientifico character varying(150) NOT NULL,
    familia character varying(100),
    genero character varying(100),
    nombre_comun character varying(200),
    descripcion text,
    usos text,
    estado_conservacion character varying(50) DEFAULT 'Estable'::character varying
);


ALTER TABLE public.especie OWNER TO ecodatos;

--
-- Name: especie_id_seq; Type: SEQUENCE; Schema: public; Owner: ecodatos
--

CREATE SEQUENCE public.especie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.especie_id_seq OWNER TO ecodatos;

--
-- Name: especie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ecodatos
--

ALTER SEQUENCE public.especie_id_seq OWNED BY public.especie.id;


--
-- Name: indicador; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.indicador (
    id integer NOT NULL,
    tipo character varying(100),
    valor numeric(10,2),
    unidad_medida character varying(50),
    fecha_calculo date DEFAULT CURRENT_DATE,
    metodologia text
);


ALTER TABLE public.indicador OWNER TO ecodatos;

--
-- Name: indicador_id_seq; Type: SEQUENCE; Schema: public; Owner: ecodatos
--

CREATE SEQUENCE public.indicador_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.indicador_id_seq OWNER TO ecodatos;

--
-- Name: indicador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ecodatos
--

ALTER SEQUENCE public.indicador_id_seq OWNED BY public.indicador.id;


--
-- Name: integrante; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.integrante (
    id integer NOT NULL,
    nombre_apellidos character varying(150) NOT NULL,
    rol character varying(50),
    telefono character varying(20),
    email character varying(100),
    especialidad character varying(100),
    CONSTRAINT integrante_rol_check CHECK (((rol)::text = ANY ((ARRAY['jefe_brigada'::character varying, 'botanico'::character varying, 'tecnico_auxiliar'::character varying, 'coinvestigador'::character varying, 'laboratorio'::character varying, 'coordinador'::character varying])::text[])))
);


ALTER TABLE public.integrante OWNER TO ecodatos;

--
-- Name: integrante_id_seq; Type: SEQUENCE; Schema: public; Owner: ecodatos
--

CREATE SEQUENCE public.integrante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.integrante_id_seq OWNER TO ecodatos;

--
-- Name: integrante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ecodatos
--

ALTER SEQUENCE public.integrante_id_seq OWNED BY public.integrante.id;


--
-- Name: logs_auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs_auditoria (
    id integer NOT NULL,
    id_usuario integer,
    accion character varying(100) NOT NULL,
    entidad character varying(100) NOT NULL,
    id_entidad integer,
    detalles text,
    ip_address character varying(45),
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.logs_auditoria OWNER TO postgres;

--
-- Name: TABLE logs_auditoria; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.logs_auditoria IS 'Registro de auditoría de acciones del sistema';


--
-- Name: COLUMN logs_auditoria.accion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.logs_auditoria.accion IS 'Tipo de acción: crear, editar, eliminar, login, logout, etc';


--
-- Name: COLUMN logs_auditoria.entidad; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.logs_auditoria.entidad IS 'Entidad afectada: usuario, conglomerado, brigada, observacion, etc';


--
-- Name: COLUMN logs_auditoria.id_entidad; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.logs_auditoria.id_entidad IS 'ID del registro afectado';


--
-- Name: COLUMN logs_auditoria.detalles; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.logs_auditoria.detalles IS 'JSON con detalles adicionales';


--
-- Name: COLUMN logs_auditoria.ip_address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.logs_auditoria.ip_address IS 'Dirección IP del usuario';


--
-- Name: logs_auditoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_auditoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_auditoria_id_seq OWNER TO postgres;

--
-- Name: logs_auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_auditoria_id_seq OWNED BY public.logs_auditoria.id;


--
-- Name: muestra; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.muestra (
    id integer NOT NULL,
    nombre_comun character varying(100),
    uso text,
    diametro numeric(10,2)
);


ALTER TABLE public.muestra OWNER TO ecodatos;

--
-- Name: muestra_id_seq; Type: SEQUENCE; Schema: public; Owner: ecodatos
--

CREATE SEQUENCE public.muestra_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.muestra_id_seq OWNER TO ecodatos;

--
-- Name: muestra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ecodatos
--

ALTER SEQUENCE public.muestra_id_seq OWNED BY public.muestra.id;


--
-- Name: muestraespecie; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.muestraespecie (
    id_muestra integer NOT NULL,
    id_especie integer NOT NULL
);


ALTER TABLE public.muestraespecie OWNER TO ecodatos;

--
-- Name: observacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observacion (
    id integer NOT NULL,
    id_conglomerado integer NOT NULL,
    id_subparcela integer,
    id_brigada integer,
    fecha_observacion timestamp without time zone DEFAULT now(),
    hora_inicio time without time zone,
    hora_fin time without time zone,
    temperatura numeric(5,2),
    humedad integer,
    condiciones_clima character varying(50),
    precipitacion character varying(50),
    observaciones_generales text,
    descripcion_vegetacion text,
    fauna_observada text,
    notas_coinvestigador text,
    pendiente_grados integer,
    tipo_suelo character varying(100),
    cobertura_vegetal character varying(100),
    erosion character varying(50),
    presencia_agua character varying(50),
    latitud_verificada numeric(10,8),
    longitud_verificada numeric(11,8),
    altitud_msnm integer,
    precision_gps character varying(20),
    fotos jsonb,
    archivos_adjuntos jsonb,
    disturbios_humanos text,
    evidencia_fauna text,
    especies_invasoras text,
    registrado_por integer,
    validado boolean DEFAULT false,
    validado_por integer,
    fecha_validacion timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    validado_por_jefe boolean DEFAULT false,
    jefe_validador_id integer,
    fecha_validacion_jefe timestamp without time zone
);


ALTER TABLE public.observacion OWNER TO postgres;

--
-- Name: observacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.observacion_id_seq OWNER TO postgres;

--
-- Name: observacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.observacion_id_seq OWNED BY public.observacion.id;


--
-- Name: proyecto; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.proyecto (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    objetivo text,
    metodologia text
);


ALTER TABLE public.proyecto OWNER TO ecodatos;

--
-- Name: proyecto_id_seq; Type: SEQUENCE; Schema: public; Owner: ecodatos
--

CREATE SEQUENCE public.proyecto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proyecto_id_seq OWNER TO ecodatos;

--
-- Name: proyecto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ecodatos
--

ALTER SEQUENCE public.proyecto_id_seq OWNED BY public.proyecto.id;


--
-- Name: proyectobrigada; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.proyectobrigada (
    id_proyecto integer NOT NULL,
    id_brigada integer NOT NULL,
    fecha_inicio date,
    fecha_fin date,
    estado character varying(20) DEFAULT 'Activo'::character varying
);


ALTER TABLE public.proyectobrigada OWNER TO ecodatos;

--
-- Name: subparcela; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.subparcela (
    id integer NOT NULL,
    coordenadas character varying(100),
    id_conglomerado integer,
    numero integer,
    nombre character varying(20),
    latitud numeric(10,8),
    longitud numeric(11,8)
);


ALTER TABLE public.subparcela OWNER TO ecodatos;

--
-- Name: subparcela_id_seq; Type: SEQUENCE; Schema: public; Owner: ecodatos
--

CREATE SEQUENCE public.subparcela_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subparcela_id_seq OWNER TO ecodatos;

--
-- Name: subparcela_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ecodatos
--

ALTER SEQUENCE public.subparcela_id_seq OWNED BY public.subparcela.id;


--
-- Name: subparcelamuestra; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.subparcelamuestra (
    id_subparcela integer NOT NULL,
    id_muestra integer NOT NULL
);


ALTER TABLE public.subparcelamuestra OWNER TO ecodatos;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: ecodatos
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    usuario character varying(50) NOT NULL,
    "contraseña" character varying(255) NOT NULL,
    tipo_usuario character varying(20) DEFAULT 'brigadista'::character varying,
    id_integrante integer,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    activo boolean DEFAULT true,
    CONSTRAINT usuarios_tipo_usuario_check CHECK (((tipo_usuario)::text = ANY ((ARRAY['admin'::character varying, 'jefe_brigada'::character varying, 'botanico'::character varying, 'tecnico_auxiliar'::character varying, 'coinvestigador'::character varying, 'laboratorio'::character varying, 'coordinador'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO ecodatos;

--
-- Name: COLUMN usuarios.tipo_usuario; Type: COMMENT; Schema: public; Owner: ecodatos
--

COMMENT ON COLUMN public.usuarios.tipo_usuario IS 'Valores: admin, brigadista, laboratorio, coordinador';


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: ecodatos
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO ecodatos;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ecodatos
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: brigada id; Type: DEFAULT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.brigada ALTER COLUMN id SET DEFAULT nextval('public.brigada_id_seq'::regclass);


--
-- Name: clasificaciontaxonomica id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificaciontaxonomica ALTER COLUMN id SET DEFAULT nextval('public.clasificaciontaxonomica_id_seq'::regclass);


--
-- Name: conglomerado id; Type: DEFAULT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.conglomerado ALTER COLUMN id SET DEFAULT nextval('public.conglomerado_id_seq'::regclass);


--
-- Name: especie id; Type: DEFAULT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.especie ALTER COLUMN id SET DEFAULT nextval('public.especie_id_seq'::regclass);


--
-- Name: indicador id; Type: DEFAULT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.indicador ALTER COLUMN id SET DEFAULT nextval('public.indicador_id_seq'::regclass);


--
-- Name: integrante id; Type: DEFAULT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.integrante ALTER COLUMN id SET DEFAULT nextval('public.integrante_id_seq'::regclass);


--
-- Name: logs_auditoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_auditoria ALTER COLUMN id SET DEFAULT nextval('public.logs_auditoria_id_seq'::regclass);


--
-- Name: muestra id; Type: DEFAULT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.muestra ALTER COLUMN id SET DEFAULT nextval('public.muestra_id_seq'::regclass);


--
-- Name: observacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion ALTER COLUMN id SET DEFAULT nextval('public.observacion_id_seq'::regclass);


--
-- Name: proyecto id; Type: DEFAULT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.proyecto ALTER COLUMN id SET DEFAULT nextval('public.proyecto_id_seq'::regclass);


--
-- Name: subparcela id; Type: DEFAULT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.subparcela ALTER COLUMN id SET DEFAULT nextval('public.subparcela_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: brigada; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.brigada (id, zona_designada, nombre, fecha_creacion, activo) FROM stdin;
\.


--
-- Data for Name: brigadaconglomerado; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.brigadaconglomerado (id_brigada, id_conglomerado, fecha_asignacion, estado) FROM stdin;
\.


--
-- Data for Name: brigadaintegrante; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.brigadaintegrante (id_brigada, id_integrante) FROM stdin;
\.


--
-- Data for Name: clasificaciontaxonomica; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clasificaciontaxonomica (id, id_muestra, id_especie, fecha_recepcion, fecha_clasificacion, estado, responsable_laboratorio, notas) FROM stdin;
\.


--
-- Data for Name: conglomerado; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.conglomerado (id, ubicacion, municipio, departamento, nombre, latitud, longitud, estado, fecha_creacion, fecha_aprobacion, brigada_id, brigada_nombre, fecha_asignacion, fecha_inicio) FROM stdin;
\.


--
-- Data for Name: conglomeradoindicador; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.conglomeradoindicador (id_conglomerado, id_indicador) FROM stdin;
\.


--
-- Data for Name: conglomeradosubparcela; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.conglomeradosubparcela (id_conglomerado, id_subparcela) FROM stdin;
\.


--
-- Data for Name: especie; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.especie (id, nombre_cientifico, familia, genero, nombre_comun, descripcion, usos, estado_conservacion) FROM stdin;
\.


--
-- Data for Name: indicador; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.indicador (id, tipo, valor, unidad_medida, fecha_calculo, metodologia) FROM stdin;
\.


--
-- Data for Name: integrante; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.integrante (id, nombre_apellidos, rol, telefono, email, especialidad) FROM stdin;
\.


--
-- Data for Name: logs_auditoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logs_auditoria (id, id_usuario, accion, entidad, id_entidad, detalles, ip_address, fecha) FROM stdin;
\.


--
-- Data for Name: muestra; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.muestra (id, nombre_comun, uso, diametro) FROM stdin;
\.


--
-- Data for Name: muestraespecie; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.muestraespecie (id_muestra, id_especie) FROM stdin;
\.


--
-- Data for Name: observacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.observacion (id, id_conglomerado, id_subparcela, id_brigada, fecha_observacion, hora_inicio, hora_fin, temperatura, humedad, condiciones_clima, precipitacion, observaciones_generales, descripcion_vegetacion, fauna_observada, notas_coinvestigador, pendiente_grados, tipo_suelo, cobertura_vegetal, erosion, presencia_agua, latitud_verificada, longitud_verificada, altitud_msnm, precision_gps, fotos, archivos_adjuntos, disturbios_humanos, evidencia_fauna, especies_invasoras, registrado_por, validado, validado_por, fecha_validacion, created_at, updated_at, validado_por_jefe, jefe_validador_id, fecha_validacion_jefe) FROM stdin;
\.


--
-- Data for Name: proyecto; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.proyecto (id, nombre, objetivo, metodologia) FROM stdin;
1	Monitoreo Amazonia 2025	Conservar biodiversidad	Muestreo estratificado
\.


--
-- Data for Name: proyectobrigada; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.proyectobrigada (id_proyecto, id_brigada, fecha_inicio, fecha_fin, estado) FROM stdin;
\.


--
-- Data for Name: subparcela; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.subparcela (id, coordenadas, id_conglomerado, numero, nombre, latitud, longitud) FROM stdin;
\.


--
-- Data for Name: subparcelamuestra; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.subparcelamuestra (id_subparcela, id_muestra) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: ecodatos
--

COPY public.usuarios (id, usuario, "contraseña", tipo_usuario, id_integrante, fecha_creacion, activo) FROM stdin;
1	admin	$2b$10$aTf9gmgY7RZTqbE1jL0pSu85.5HcuGXtYu0sg0GQELCKLt8itnQK.	admin	\N	2025-11-12 14:12:42.967846	t
\.


--
-- Name: brigada_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ecodatos
--

SELECT pg_catalog.setval('public.brigada_id_seq', 1, false);


--
-- Name: clasificaciontaxonomica_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clasificaciontaxonomica_id_seq', 1, false);


--
-- Name: conglomerado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ecodatos
--

SELECT pg_catalog.setval('public.conglomerado_id_seq', 1, false);


--
-- Name: especie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ecodatos
--

SELECT pg_catalog.setval('public.especie_id_seq', 1, false);


--
-- Name: indicador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ecodatos
--

SELECT pg_catalog.setval('public.indicador_id_seq', 1, false);


--
-- Name: integrante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ecodatos
--

SELECT pg_catalog.setval('public.integrante_id_seq', 1, false);


--
-- Name: logs_auditoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_auditoria_id_seq', 1, false);


--
-- Name: muestra_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ecodatos
--

SELECT pg_catalog.setval('public.muestra_id_seq', 1, false);


--
-- Name: observacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.observacion_id_seq', 1, false);


--
-- Name: proyecto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ecodatos
--

SELECT pg_catalog.setval('public.proyecto_id_seq', 1, false);


--
-- Name: subparcela_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ecodatos
--

SELECT pg_catalog.setval('public.subparcela_id_seq', 1, false);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ecodatos
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


--
-- Name: brigada brigada_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.brigada
    ADD CONSTRAINT brigada_pkey PRIMARY KEY (id);


--
-- Name: brigadaconglomerado brigadaconglomerado_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.brigadaconglomerado
    ADD CONSTRAINT brigadaconglomerado_pkey PRIMARY KEY (id_brigada, id_conglomerado);


--
-- Name: brigadaintegrante brigadaintegrante_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.brigadaintegrante
    ADD CONSTRAINT brigadaintegrante_pkey PRIMARY KEY (id_brigada, id_integrante);


--
-- Name: clasificaciontaxonomica clasificaciontaxonomica_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificaciontaxonomica
    ADD CONSTRAINT clasificaciontaxonomica_pkey PRIMARY KEY (id);


--
-- Name: conglomerado conglomerado_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.conglomerado
    ADD CONSTRAINT conglomerado_pkey PRIMARY KEY (id);


--
-- Name: conglomeradoindicador conglomeradoindicador_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.conglomeradoindicador
    ADD CONSTRAINT conglomeradoindicador_pkey PRIMARY KEY (id_conglomerado, id_indicador);


--
-- Name: conglomeradosubparcela conglomeradosubparcela_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.conglomeradosubparcela
    ADD CONSTRAINT conglomeradosubparcela_pkey PRIMARY KEY (id_conglomerado, id_subparcela);


--
-- Name: especie especie_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.especie
    ADD CONSTRAINT especie_pkey PRIMARY KEY (id);


--
-- Name: indicador indicador_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.indicador
    ADD CONSTRAINT indicador_pkey PRIMARY KEY (id);


--
-- Name: integrante integrante_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.integrante
    ADD CONSTRAINT integrante_pkey PRIMARY KEY (id);


--
-- Name: logs_auditoria logs_auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_auditoria
    ADD CONSTRAINT logs_auditoria_pkey PRIMARY KEY (id);


--
-- Name: muestra muestra_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.muestra
    ADD CONSTRAINT muestra_pkey PRIMARY KEY (id);


--
-- Name: muestraespecie muestraespecie_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.muestraespecie
    ADD CONSTRAINT muestraespecie_pkey PRIMARY KEY (id_muestra, id_especie);


--
-- Name: observacion observacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT observacion_pkey PRIMARY KEY (id);


--
-- Name: proyecto proyecto_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.proyecto
    ADD CONSTRAINT proyecto_pkey PRIMARY KEY (id);


--
-- Name: proyectobrigada proyectobrigada_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.proyectobrigada
    ADD CONSTRAINT proyectobrigada_pkey PRIMARY KEY (id_proyecto, id_brigada);


--
-- Name: subparcela subparcela_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.subparcela
    ADD CONSTRAINT subparcela_pkey PRIMARY KEY (id);


--
-- Name: subparcelamuestra subparcelamuestra_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.subparcelamuestra
    ADD CONSTRAINT subparcelamuestra_pkey PRIMARY KEY (id_subparcela, id_muestra);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_usuario_key; Type: CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_usuario_key UNIQUE (usuario);


--
-- Name: idx_clasificacion_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clasificacion_estado ON public.clasificaciontaxonomica USING btree (estado);


--
-- Name: idx_clasificacion_muestra; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clasificacion_muestra ON public.clasificaciontaxonomica USING btree (id_muestra);


--
-- Name: idx_logs_accion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_accion ON public.logs_auditoria USING btree (accion);


--
-- Name: idx_logs_entidad; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_entidad ON public.logs_auditoria USING btree (entidad);


--
-- Name: idx_logs_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_fecha ON public.logs_auditoria USING btree (fecha);


--
-- Name: idx_logs_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_usuario ON public.logs_auditoria USING btree (id_usuario);


--
-- Name: idx_observacion_brigada; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_brigada ON public.observacion USING btree (id_brigada);


--
-- Name: idx_observacion_conglomerado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_conglomerado ON public.observacion USING btree (id_conglomerado);


--
-- Name: idx_observacion_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_fecha ON public.observacion USING btree (fecha_observacion);


--
-- Name: idx_observacion_subparcela; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_observacion_subparcela ON public.observacion USING btree (id_subparcela);


--
-- Name: brigadaconglomerado brigadaconglomerado_id_brigada_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.brigadaconglomerado
    ADD CONSTRAINT brigadaconglomerado_id_brigada_fkey FOREIGN KEY (id_brigada) REFERENCES public.brigada(id) ON DELETE CASCADE;


--
-- Name: brigadaconglomerado brigadaconglomerado_id_conglomerado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.brigadaconglomerado
    ADD CONSTRAINT brigadaconglomerado_id_conglomerado_fkey FOREIGN KEY (id_conglomerado) REFERENCES public.conglomerado(id) ON DELETE CASCADE;


--
-- Name: brigadaintegrante brigadaintegrante_id_brigada_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.brigadaintegrante
    ADD CONSTRAINT brigadaintegrante_id_brigada_fkey FOREIGN KEY (id_brigada) REFERENCES public.brigada(id) ON DELETE CASCADE;


--
-- Name: brigadaintegrante brigadaintegrante_id_integrante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.brigadaintegrante
    ADD CONSTRAINT brigadaintegrante_id_integrante_fkey FOREIGN KEY (id_integrante) REFERENCES public.integrante(id) ON DELETE CASCADE;


--
-- Name: clasificaciontaxonomica clasificaciontaxonomica_id_especie_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificaciontaxonomica
    ADD CONSTRAINT clasificaciontaxonomica_id_especie_fkey FOREIGN KEY (id_especie) REFERENCES public.especie(id) ON DELETE SET NULL;


--
-- Name: clasificaciontaxonomica clasificaciontaxonomica_id_muestra_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasificaciontaxonomica
    ADD CONSTRAINT clasificaciontaxonomica_id_muestra_fkey FOREIGN KEY (id_muestra) REFERENCES public.muestra(id) ON DELETE CASCADE;


--
-- Name: conglomeradoindicador conglomeradoindicador_id_conglomerado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.conglomeradoindicador
    ADD CONSTRAINT conglomeradoindicador_id_conglomerado_fkey FOREIGN KEY (id_conglomerado) REFERENCES public.conglomerado(id) ON DELETE CASCADE;


--
-- Name: conglomeradoindicador conglomeradoindicador_id_indicador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.conglomeradoindicador
    ADD CONSTRAINT conglomeradoindicador_id_indicador_fkey FOREIGN KEY (id_indicador) REFERENCES public.indicador(id) ON DELETE CASCADE;


--
-- Name: conglomeradosubparcela conglomeradosubparcela_id_conglomerado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.conglomeradosubparcela
    ADD CONSTRAINT conglomeradosubparcela_id_conglomerado_fkey FOREIGN KEY (id_conglomerado) REFERENCES public.conglomerado(id) ON DELETE CASCADE;


--
-- Name: conglomeradosubparcela conglomeradosubparcela_id_subparcela_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.conglomeradosubparcela
    ADD CONSTRAINT conglomeradosubparcela_id_subparcela_fkey FOREIGN KEY (id_subparcela) REFERENCES public.subparcela(id) ON DELETE CASCADE;


--
-- Name: logs_auditoria fk_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_auditoria
    ADD CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: muestraespecie muestraespecie_id_especie_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.muestraespecie
    ADD CONSTRAINT muestraespecie_id_especie_fkey FOREIGN KEY (id_especie) REFERENCES public.especie(id) ON DELETE CASCADE;


--
-- Name: muestraespecie muestraespecie_id_muestra_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.muestraespecie
    ADD CONSTRAINT muestraespecie_id_muestra_fkey FOREIGN KEY (id_muestra) REFERENCES public.muestra(id) ON DELETE CASCADE;


--
-- Name: observacion observacion_id_brigada_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT observacion_id_brigada_fkey FOREIGN KEY (id_brigada) REFERENCES public.brigada(id) ON DELETE SET NULL;


--
-- Name: observacion observacion_id_conglomerado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT observacion_id_conglomerado_fkey FOREIGN KEY (id_conglomerado) REFERENCES public.conglomerado(id) ON DELETE CASCADE;


--
-- Name: observacion observacion_id_subparcela_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT observacion_id_subparcela_fkey FOREIGN KEY (id_subparcela) REFERENCES public.subparcela(id) ON DELETE SET NULL;


--
-- Name: observacion observacion_jefe_validador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT observacion_jefe_validador_id_fkey FOREIGN KEY (jefe_validador_id) REFERENCES public.usuarios(id);


--
-- Name: observacion observacion_registrado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT observacion_registrado_por_fkey FOREIGN KEY (registrado_por) REFERENCES public.usuarios(id);


--
-- Name: observacion observacion_validado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observacion
    ADD CONSTRAINT observacion_validado_por_fkey FOREIGN KEY (validado_por) REFERENCES public.usuarios(id);


--
-- Name: proyectobrigada proyectobrigada_id_brigada_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.proyectobrigada
    ADD CONSTRAINT proyectobrigada_id_brigada_fkey FOREIGN KEY (id_brigada) REFERENCES public.brigada(id) ON DELETE CASCADE;


--
-- Name: proyectobrigada proyectobrigada_id_proyecto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.proyectobrigada
    ADD CONSTRAINT proyectobrigada_id_proyecto_fkey FOREIGN KEY (id_proyecto) REFERENCES public.proyecto(id) ON DELETE CASCADE;


--
-- Name: subparcela subparcela_id_conglomerado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.subparcela
    ADD CONSTRAINT subparcela_id_conglomerado_fkey FOREIGN KEY (id_conglomerado) REFERENCES public.conglomerado(id) ON DELETE CASCADE;


--
-- Name: subparcelamuestra subparcelamuestra_id_muestra_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.subparcelamuestra
    ADD CONSTRAINT subparcelamuestra_id_muestra_fkey FOREIGN KEY (id_muestra) REFERENCES public.muestra(id) ON DELETE CASCADE;


--
-- Name: subparcelamuestra subparcelamuestra_id_subparcela_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.subparcelamuestra
    ADD CONSTRAINT subparcelamuestra_id_subparcela_fkey FOREIGN KEY (id_subparcela) REFERENCES public.subparcela(id) ON DELETE CASCADE;


--
-- Name: usuarios usuarios_id_integrante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ecodatos
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_integrante_fkey FOREIGN KEY (id_integrante) REFERENCES public.integrante(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO ecodatos;


--
-- Name: TABLE clasificaciontaxonomica; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clasificaciontaxonomica TO ecodatos;


--
-- Name: SEQUENCE clasificaciontaxonomica_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.clasificaciontaxonomica_id_seq TO ecodatos;


--
-- Name: TABLE logs_auditoria; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.logs_auditoria TO ecodatos;


--
-- Name: SEQUENCE logs_auditoria_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.logs_auditoria_id_seq TO ecodatos;


--
-- Name: TABLE observacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.observacion TO ecodatos;


--
-- Name: SEQUENCE observacion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.observacion_id_seq TO ecodatos;


--
-- PostgreSQL database dump complete
--

\unrestrict ZqvDbJLERfdxfwJAEZ3RHN0RFH4n1R7uE0qqnrPQrTyBqSyLwZOQlE4ziU2uTEs

