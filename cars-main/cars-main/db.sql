--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3

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
-- Name: carcats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carcats (
    value character varying(10) NOT NULL,
    catname character varying(255)
);


ALTER TABLE public.carcats OWNER TO postgres;

--
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    id integer NOT NULL,
    strahovatel integer,
    sobstvennik integer,
    carcat character varying(10),
    number character varying(13),
    model integer,
    power integer,
    idtype character varying(10),
    idcode character varying(255),
    driverdata character varying(255)[],
    phone character varying(30),
    email character varying(30),
    service integer,
    price integer,
    date date,
    "time" character varying(30),
    calltype character varying(20),
    msg character varying(255)
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- Name: idtypes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.idtypes (
    value character varying(10) NOT NULL,
    label character varying(10)
);


ALTER TABLE public.idtypes OWNER TO postgres;

--
-- Name: models; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.models (
    id integer NOT NULL,
    mark character varying(255),
    model character varying(255)
);


ALTER TABLE public.models OWNER TO postgres;

--
-- Name: persons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.persons (
    id integer NOT NULL,
    firstname character varying(30),
    secondname character varying(35),
    lastname character varying(30),
    birthdate date,
    passportser character varying(4),
    passportnum character varying(6),
    passportdate date,
    address character varying(255),
    aparts integer
);


ALTER TABLE public.persons OWNER TO postgres;

--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id integer NOT NULL,
    type character varying(10)
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: admintable; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.admintable AS
 SELECT clients.id,
    persons.firstname,
    persons.secondname,
    persons.lastname,
    persons.birthdate,
    persons.passportser,
    persons.passportnum,
    persons.passportdate,
    persons.address,
    persons.aparts,
    strahovatels.firstname AS stfirstname,
    strahovatels.secondname AS stsecondname,
    strahovatels.lastname AS stlastname,
    strahovatels.birthdate AS stbirthdate,
    strahovatels.passportser AS stpassportser,
    strahovatels.passportnum AS stpassportnum,
    strahovatels.passportdate AS stpassportdate,
    strahovatels.address AS staddress,
    strahovatels.aparts AS staparts,
    carcats.value,
    carcats.catname,
    clients.number,
    models.mark,
    models.model,
    clients.power,
    clients.idcode,
    clients.driverdata,
    clients.phone,
    clients.email,
    clients.price,
    services.type,
    idtypes.label AS idtype,
    idtypes.value AS idvalue,
    clients."time",
    clients.calltype,
    clients.msg
   FROM public.persons,
    public.persons strahovatels,
    ((((public.clients
     LEFT JOIN public.services ON ((services.id = clients.service)))
     LEFT JOIN public.carcats ON (((carcats.value)::text = (clients.carcat)::text)))
     LEFT JOIN public.idtypes ON (((idtypes.value)::text = (clients.idtype)::text)))
     LEFT JOIN public.models ON ((models.id = clients.model)))
  WHERE ((persons.id = clients.sobstvennik) AND (strahovatels.id = clients.strahovatel));


ALTER TABLE public.admintable OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.clients_id_seq OWNER TO postgres;

--
-- Name: clients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_id_seq OWNED BY public.clients.id;


--
-- Name: docs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.docs (
    id integer NOT NULL,
    userid integer,
    path character varying(255),
    name character varying(255)
);


ALTER TABLE public.docs OWNER TO postgres;

--
-- Name: docs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.docs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.docs_id_seq OWNER TO postgres;

--
-- Name: docs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.docs_id_seq OWNED BY public.docs.id;


--
-- Name: exportdata; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.exportdata AS
 SELECT persons.firstname,
    persons.secondname,
    persons.lastname,
    clients.phone,
    clients.email,
    services.type,
    to_char((clients.date)::timestamp with time zone, 'dd.mm.yyyy'::text) AS date
   FROM public.persons,
    public.clients,
    public.services
  WHERE ((persons.id = clients.sobstvennik) AND (services.id = clients.service));


ALTER TABLE public.exportdata OWNER TO postgres;

--
-- Name: models_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.models_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.models_id_seq OWNER TO postgres;

--
-- Name: models_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.models_id_seq OWNED BY public.models.id;


--
-- Name: persons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.persons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.persons_id_seq OWNER TO postgres;

--
-- Name: persons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.persons_id_seq OWNED BY public.persons.id;


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.services_id_seq OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    token character varying(255),
    name character varying(255),
    email character varying(255),
    hash_pwd character varying(255),
    role integer DEFAULT 1,
    documents character varying(255)[]
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.clients_id_seq'::regclass);


--
-- Name: docs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docs ALTER COLUMN id SET DEFAULT nextval('public.docs_id_seq'::regclass);


--
-- Name: models id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.models ALTER COLUMN id SET DEFAULT nextval('public.models_id_seq'::regclass);


--
-- Name: persons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persons ALTER COLUMN id SET DEFAULT nextval('public.persons_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: carcats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carcats (value, catname) FROM stdin;
V	В - автомобиль
A	A - мотоцикл
C	C - грузовик
D	D - автобус
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clients (id, strahovatel, sobstvennik, carcat, number, model, power, idtype, idcode, driverdata, phone, email, service, price, date, "time", calltype, msg) FROM stdin;
22	83	82	V	а 234 аа 24	56	123	vin	2342dfsdfg2345gfd	{"{\\"birthDate\\":\\"1995-06-03\\",\\"lastName\\":\\"Васильев\\",\\"name\\":\\"Владислав\\",\\"secondName\\":\\"Петрович\\",\\"startYear\\":\\"2010-06-02\\",\\"vu\\":\\"32 42 354534\\"}"}	+79964283390	johnmashina@mail.ru	1	6523	2022-05-26	10-20 мск	Звонок	\N
\.


--
-- Data for Name: docs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.docs (id, userid, path, name) FROM stdin;
39	28	D:\\projects\\cars\\uploads\\28\\	Полис.jpeg
40	28	D:\\projects\\cars\\uploads\\28\\	Свидетельство.pdf
\.


--
-- Data for Name: idtypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.idtypes (value, label) FROM stdin;
vin	VIN
body	Кузов
shassi	Шасси
\.


--
-- Data for Name: models; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.models (id, mark, model) FROM stdin;
1	Acura	CDX
2	Acura	CL
3	Acura	EL
4	Acura	ILX
5	Acura	Integra
6	Acura	MDX
7	Acura	NSX
8	Acura	RDX
9	Acura	RL
10	Acura	RLX
11	Acura	RSX
12	Acura	TL
13	Acura	TLX
14	Acura	TLX-L
15	Acura	TSX
16	Acura	ZDX
17	Alfa Romeo	146
18	Alfa Romeo	147
19	Alfa Romeo	147 GTA
20	Alfa Romeo	156
21	Alfa Romeo	156 GTA
22	Alfa Romeo	159
23	Alfa Romeo	166
24	Alfa Romeo	4C
25	Alfa Romeo	8C Competizione
26	Alfa Romeo	Brera
27	Alfa Romeo	Giulia
28	Alfa Romeo	Giulietta
29	Alfa Romeo	GT
30	Alfa Romeo	GTV
31	Alfa Romeo	MiTo
32	Alfa Romeo	Spider
33	Alfa Romeo	Stelvio
34	Alfa Romeo	Tonale
35	Aston Martin	Cygnet
36	Aston Martin	DB11
37	Aston Martin	DB9
38	Aston Martin	DBS
39	Aston Martin	DBS Superleggera
40	Aston Martin	DBS Violante
41	Aston Martin	DBX
42	Aston Martin	Rapide
43	Aston Martin	V12 Vanquish
44	Aston Martin	V12 Vantage
45	Aston Martin	V8 Vantage
46	Aston Martin	Valkyrie
47	Aston Martin	Vanquish
48	Aston Martin	Vantage
49	Aston Martin	Virage
50	Aston Martin	Zagato Coupe
51	Audi	A1
52	Audi	A2
53	Audi	A3
54	Audi	A4
55	Audi	A4 Allroad Quattro
56	Audi	A5
57	Audi	A6
58	Audi	A7
59	Audi	A8
60	Audi	Allroad
61	Audi	e-tron
62	Audi	e-tron GT
63	Audi	e-tron Sportback
64	Audi	Q2
65	Audi	Q3
66	Audi	Q3 Sportback
67	Audi	Q4
68	Audi	Q4 Sportback
69	Audi	Q5
70	Audi	Q5 Sportback
71	Audi	Q7
72	Audi	Q8
73	Audi	R8
74	Audi	RS e-tron GT
75	Audi	RS Q3
76	Audi	RS Q3 Sportback
77	Audi	RS Q7
78	Audi	RS Q8
79	Audi	RS3
80	Audi	RS4
81	Audi	RS5
82	Audi	RS6
83	Audi	RS7
84	Audi	S1
85	Audi	S3
86	Audi	S4
87	Audi	S5
88	Audi	S6
89	Audi	S7
90	Audi	S8
91	Audi	SQ2
92	Audi	SQ5
93	Audi	SQ5 Sportback
94	Audi	SQ7
95	Audi	SQ8
96	Audi	TT
97	Audi	TT RS
98	Audi	TTS
99	Bentley	Arnage
100	Bentley	Azure
101	Bentley	Bentayga
102	Bentley	Brooklands
103	Bentley	Continental
104	Bentley	Continental Flying Spur
105	Bentley	Continental GT
106	Bentley	Flying Spur
107	Bentley	Mulsanne
108	BMW	1 series
109	BMW	2 series
110	BMW	3 series
111	BMW	4 series
112	BMW	5 series
113	BMW	6 series
114	BMW	7 series
115	BMW	8 series
116	BMW	i3
117	BMW	i4
118	BMW	i8
119	BMW	iX
120	BMW	iX3
121	BMW	M2
122	BMW	M3
123	BMW	M4
124	BMW	M5
125	BMW	M6
126	BMW	M8
127	BMW	X1
128	BMW	X2
129	BMW	X3
130	BMW	X3 M
131	BMW	X4
132	BMW	X4 M
133	BMW	X5
134	BMW	X5 M
135	BMW	X6
136	BMW	X6 M
137	BMW	X7
138	BMW	Z3
139	BMW	Z4
140	BMW	Z8
141	Brilliance	H230
142	Brilliance	V3
143	Brilliance	V5
144	Bugatti	Chiron
145	Bugatti	Veyron
146	Buick	Century
147	Buick	Enclave
148	Buick	Encore
149	Buick	Envision
150	Buick	La Crosse
151	Buick	LaCrosse
152	Buick	Le Sabre
153	Buick	Lucerne
154	Buick	Park Avenue
155	Buick	Rainier
156	Buick	Regal
157	Buick	Rendezvouz
158	Buick	Terraza
159	Buick	Verano
160	BYD	Qin
161	Cadillac	ATS
162	Cadillac	ATS-V
163	Cadillac	BLS
164	Cadillac	CT4
165	Cadillac	CT4-V
166	Cadillac	CT5
167	Cadillac	CT5-V
168	Cadillac	CT6
169	Cadillac	CTS
170	Cadillac	De Ville
171	Cadillac	DTS
172	Cadillac	Eldorado
173	Cadillac	ELR
174	Cadillac	Escalade
175	Cadillac	Seville
176	Cadillac	SRX
177	Cadillac	STS
178	Cadillac	XLR
179	Cadillac	XT4
180	Cadillac	XT5
181	Cadillac	XT6
182	Cadillac	XTS
183	Changan	CS35
184	Changan	CS35 Plus
185	Changan	CS55
186	Changan	CS55 Plus
187	Changan	CS75
188	Changan	CS75 Plus
189	Changan	CS95
190	Changan	Eado
191	Changan	Raeton
192	Changan	Uni-K
193	Chery	Amulet
194	Chery	Arrizo 7
195	Chery	Bonus
196	Chery	Bonus 3
197	Chery	CrossEastar
198	Chery	Eastar
199	Chery	Fora
200	Chery	IndiS
201	Chery	Kimo
202	Chery	M11
203	Chery	QQ
204	Chery	QQ6
205	Chery	Tiggo
206	Chery	Tiggo 3
207	Chery	Tiggo 4
208	Chery	Tiggo 4 Pro
209	Chery	Tiggo 5
210	Chery	Tiggo 7
211	Chery	Tiggo 7 Pro
212	Chery	Tiggo 8
213	Chery	Tiggo 8 Plus
214	Chery	Tiggo 8 Pro
215	Chery	Very
216	Chevrolet	Astro
217	Chevrolet	Avalanche
218	Chevrolet	Aveo
219	Chevrolet	Beat
220	Chevrolet	Blazer
221	Chevrolet	Bolt
222	Chevrolet	Camaro
223	Chevrolet	Captiva
224	Chevrolet	Cavalier
225	Chevrolet	Cobalt
226	Chevrolet	Colorado
227	Chevrolet	Corvette
228	Chevrolet	Cruze
229	Chevrolet	Epica
230	Chevrolet	Equinox
231	Chevrolet	Express
232	Chevrolet	HHR
233	Chevrolet	Impala
234	Chevrolet	Lacetti
235	Chevrolet	Lanos
236	Chevrolet	Malibu
237	Chevrolet	Monte Carlo
238	Chevrolet	Niva
239	Chevrolet	Orlando
240	Chevrolet	Rezzo
241	Chevrolet	Silverado
242	Chevrolet	Silverado 1500
243	Chevrolet	Silverado 2500 HD
244	Chevrolet	Spark
245	Chevrolet	SSR
246	Chevrolet	Suburban
247	Chevrolet	Tahoe
248	Chevrolet	TrailBlazer
249	Chevrolet	Traverse
250	Chevrolet	Trax
251	Chevrolet	Uplander
252	Chevrolet	Venture
253	Chrysler	200
254	Chrysler	300
255	Chrysler	300M
256	Chrysler	Aspen
257	Chrysler	Concorde
258	Chrysler	Crossfire
259	Chrysler	Grand Voyager
260	Chrysler	Pacifica
261	Chrysler	PT Cruiser
262	Chrysler	Sebring
263	Chrysler	Town & Country
264	Chrysler	Voyager
265	Citroen	Berlingo
266	Citroen	C-Crosser
267	Citroen	C-Elysee
268	Citroen	C1
269	Citroen	C2
270	Citroen	C3
271	Citroen	C3 Aircross
272	Citroen	C3 Picasso
273	Citroen	C3 Pluriel
274	Citroen	C4
275	Citroen	C4 Aircross
276	Citroen	C4 Cactus
277	Citroen	C4 Picasso
278	Citroen	C5
279	Citroen	C5 Aircross
280	Citroen	C6
281	Citroen	C8
282	Citroen	DS 7 Crossback
283	Citroen	DS3
284	Citroen	DS4
285	Citroen	DS5
286	Citroen	Grand C4 Picasso
287	Citroen	Jumper
288	Citroen	Jumpy
289	Citroen	Nemo
290	Citroen	Saxo
291	Citroen	Spacetourer
292	Citroen	Xsara
293	Citroen	Xsara Picasso
294	Dacia	Dokker
295	Dacia	Lodgy
296	Dacia	Solenza
297	Dacia	Spring
298	Dacia	SupeRNova
299	Daewoo	Evanda
300	Daewoo	Kalos
301	Daewoo	Leganza
302	Daewoo	Magnus
303	Daewoo	Matiz
304	Daewoo	Nexia
305	Daewoo	Nubira
306	Daihatsu	Applause
307	Daihatsu	Cast
308	Daihatsu	Copen
309	Daihatsu	Cuore
310	Daihatsu	Gran Move
311	Daihatsu	Luxio
312	Daihatsu	Materia
313	Daihatsu	Mebius
314	Daihatsu	Move
315	Daihatsu	Rocky
316	Daihatsu	Sirion
317	Daihatsu	Terios
318	Daihatsu	Trevis
319	Daihatsu	YRV
320	Datsun	mi-DO
321	Datsun	on-DO
322	Dodge	Avenger
323	Dodge	Caliber
324	Dodge	Caliber SRT4
325	Dodge	Caravan
326	Dodge	Challenger
327	Dodge	Charger
328	Dodge	Dakota
329	Dodge	Dart
330	Dodge	Durango
331	Dodge	Intrepid
332	Dodge	Journey
333	Dodge	Magnum
334	Dodge	Neon
335	Dodge	Nitro
336	Dodge	Ram 1500
337	Dodge	Ram 2500
338	Dodge	Ram 3500
339	Dodge	Ram SRT10
340	Dodge	Stratus
341	Dodge	Viper
342	Dongfeng	580
343	Dongfeng	A30
344	Dongfeng	AX7
345	Dongfeng	H30 Cross
346	Exeed	TXL
347	Exeed	VX
348	FAW	Besturn B30
349	FAW	Besturn B50
350	FAW	Besturn B70
351	FAW	Besturn X40
352	FAW	Besturn X80
353	FAW	Oley
354	FAW	Vita
355	Ferrari	348
356	Ferrari	360
357	Ferrari	456
358	Ferrari	458
359	Ferrari	488
360	Ferrari	512
361	Ferrari	550
362	Ferrari	575 M
363	Ferrari	599 GTB Fiorano
364	Ferrari	599 GTO
365	Ferrari	612
366	Ferrari	812
367	Ferrari	812 GTS
368	Ferrari	California
369	Ferrari	California T
370	Ferrari	Challenge Stradale
371	Ferrari	Enzo
372	Ferrari	F12
373	Ferrari	F355
374	Ferrari	F430
375	Ferrari	F50
376	Ferrari	F512 M
377	Ferrari	F8 Spider
378	Ferrari	F8 Tributo
379	Ferrari	FF
380	Ferrari	GTC4 Lusso
381	Ferrari	LaFerrari
382	Ferrari	Portofino
383	Ferrari	Portofino M
384	Ferrari	Roma
385	Ferrari	SF90 Spider
386	Ferrari	SF90 Stradale
387	Fiat	124 Spider
388	Fiat	500
389	Fiat	500L
390	Fiat	500X
391	Fiat	Albea
392	Fiat	Brava
393	Fiat	Bravo
394	Fiat	Coupe
395	Fiat	Croma
396	Fiat	Doblo
397	Fiat	Ducato
398	Fiat	Freemont
399	Fiat	Grande Punto
400	Fiat	Idea
401	Fiat	Linea
402	Fiat	Marea
403	Fiat	Multipla
404	Fiat	Palio
405	Fiat	Panda
406	Fiat	Panda 4x4
407	Fiat	Punto
408	Fiat	Qubo
409	Fiat	Sedici
410	Fiat	Siena
411	Fiat	Stilo
412	Fiat	Strada
413	Fiat	Tipo
414	Fiat	Ulysse
415	Fisker	Karma
416	Ford	B-Max
417	Ford	Bronco
418	Ford	Bronco Sport
419	Ford	C-Max
420	Ford	Cougar
421	Ford	Crown Victoria
422	Ford	EcoSport
423	Ford	Edge
424	Ford	Endura
425	Ford	Equator
426	Ford	Escape
427	Ford	Excursion
428	Ford	Expedition
429	Ford	Explorer
430	Ford	Explorer Sport Trac
431	Ford	F-150
432	Ford	F-250
433	Ford	F-350
434	Ford	Falcon
435	Ford	Fiesta
436	Ford	Five Hundred
437	Ford	Flex
438	Ford	Focus
439	Ford	Focus Active
440	Ford	Focus Electric
441	Ford	Freestar
442	Ford	Freestyle
443	Ford	Fusion
444	Ford	Galaxy
445	Ford	Ka
446	Ford	Kuga
447	Ford	Maverick
448	Ford	Mondeo
449	Ford	Mustang
450	Ford	Mustang Mach-E
451	Ford	Mustang Shelby GT350
452	Ford	Mustang Shelby GT500
453	Ford	Puma
454	Ford	Ranger
455	Ford	S-Max
456	Ford	Taurus
457	Ford	Taurus X
458	Ford	Thunderbird
459	Ford	Tourneo Connect
460	Ford	Transit
461	Ford	Transit Connect
462	Foton	Sauvana
463	GAC	GS5
464	GAC	Trumpchi GM8
465	GAC	Trumpchi GS8
466	GAZ	3102
467	GAZ	31105
468	GAZ	Siber
469	GAZ	Sobol
470	Geely	Atlas
471	Geely	Coolray
472	Geely	Emgrand 7
473	Geely	Emgrand EC7
474	Geely	Emgrand GS
475	Geely	Emgrand X7
476	Geely	GC9
477	Geely	GРЎ6
478	Geely	MK
479	Geely	Otaka
480	Geely	Tugella
481	Geely	Vision
482	Genesis	G70
483	Genesis	G80
484	Genesis	G90
485	Genesis	GV70
486	Genesis	GV80
487	GMC	Acadia
488	GMC	Canyon
489	GMC	Envoy
490	GMC	Sierra 1500
491	GMC	Sierra 2500
492	GMC	Sierra 3500
493	GMC	Terrain
494	GMC	Yukon
495	Great Wall	Cowry
496	Great Wall	Deer
497	Great Wall	Hover
498	Great Wall	Hover M2
499	Great Wall	Pegasus
500	Great Wall	Peri
501	Great Wall	Safe
502	Great Wall	Sailor
503	Great Wall	Sing
504	Great Wall	Socool
505	Great Wall	Wingle
506	Haval	F7
507	Haval	F7x
508	Haval	H4
509	Haval	H6
510	Haval	H9
511	Haval	Jolion
512	Holden	Commodore
513	Holden	Corvette C8
514	Honda	Accord
515	Honda	Amaze
516	Honda	City
517	Honda	Civic
518	Honda	Civic Type R
519	Honda	CR-V
520	Honda	CR-Z
521	Honda	Crosstour
522	Honda	e
523	Honda	Element
524	Honda	Fit
525	Honda	FR-V
526	Honda	HR-V
527	Honda	Insight
528	Honda	Jade
529	Honda	Jazz
530	Honda	Legend
531	Honda	Odyssey
532	Honda	Pilot
533	Honda	Prelude
534	Honda	Ridgeline
535	Honda	S2000
536	Honda	Shuttle
537	Honda	Stream
538	Honda	Vezel
539	Hummer	H1
540	Hummer	H2
541	Hummer	H3
542	Hyundai	Accent
543	Hyundai	Atos Prime
544	Hyundai	Azera
545	Hyundai	Bayon
546	Hyundai	Centennial
547	Hyundai	Creta
548	Hyundai	Elantra
549	Hyundai	Entourage
550	Hyundai	Eon
551	Hyundai	Equus
552	Hyundai	Galloper
553	Hyundai	Genesis
554	Hyundai	Genesis Coupe
555	Hyundai	Getz
556	Hyundai	Grandeur
557	Hyundai	H-1
558	Hyundai	i10
559	Hyundai	i20
560	Hyundai	i30
561	Hyundai	i30 N
562	Hyundai	i40
563	Hyundai	Ioniq
564	Hyundai	Ioniq 5
565	Hyundai	ix20
566	Hyundai	ix35
567	Hyundai	Kona
568	Hyundai	Kona N
569	Hyundai	Matrix
570	Hyundai	Palisade
571	Hyundai	Porter
572	Hyundai	Santa Fe
573	Hyundai	Solaris
574	Hyundai	Sonata
575	Hyundai	Terracan
576	Hyundai	Trajet
577	Hyundai	Tucson
578	Hyundai	Veloster
579	Hyundai	Venue
580	Hyundai	Veracruz
581	Hyundai	Verna
582	Hyundai	Xcent
583	Hyundai	XG
584	Infiniti	EX
585	Infiniti	FX
586	Infiniti	G
587	Infiniti	I35
588	Infiniti	JX
589	Infiniti	M
590	Infiniti	Q30
591	Infiniti	Q40
592	Infiniti	Q45
593	Infiniti	Q50
594	Infiniti	Q60
595	Infiniti	Q70
596	Infiniti	QX30
597	Infiniti	QX4
598	Infiniti	QX50
599	Infiniti	QX55
600	Infiniti	QX56
601	Infiniti	QX60
602	Infiniti	QX70
603	Infiniti	QX80
604	Isuzu	Ascender
605	Isuzu	Axiom
606	Isuzu	D-Max
607	Isuzu	D-Max Rodeo
608	Isuzu	I280
609	Isuzu	I290
610	Isuzu	I350
611	Isuzu	I370
612	Isuzu	Rodeo
613	Isuzu	Trooper
614	Isuzu	VehiCross
615	Iveco	Daily
616	Jac	iEV7S
617	Jac	T6
618	Jaguar	E-Pace
619	Jaguar	F-Pace
620	Jaguar	F-Type
621	Jaguar	I-Pace
622	Jaguar	S-Type
623	Jaguar	X-Type
624	Jaguar	XE
625	Jaguar	XF
626	Jaguar	XJ
627	Jaguar	XK/XKR
628	Jeep	Cherokee
629	Jeep	Commander
630	Jeep	Compass
631	Jeep	Gladiator
632	Jeep	Grand Cherokee
633	Jeep	Liberty
634	Jeep	Patriot
635	Jeep	Renegade
636	Jeep	Wagoneer
637	Jeep	Wrangler
638	Kia	Carens
639	Kia	Carnival
640	Kia	Ceed
641	Kia	Cerato
642	Kia	Clarus
643	Kia	Forte
644	Kia	K5
645	Kia	K8
646	Kia	K900
647	Kia	Magentis
648	Kia	Mohave
649	Kia	Niro
650	Kia	Opirus
651	Kia	Optima
652	Kia	Picanto
653	Kia	ProCeed
654	Kia	Quoris
655	Kia	Ray
656	Kia	Rio
657	Kia	Rio X
658	Kia	Rio X-Line
659	Kia	Seltos
660	Kia	Shuma
661	Kia	Sonet
662	Kia	Sorento
663	Kia	Sorento Prime
664	Kia	Soul
665	Kia	Spectra
666	Kia	Sportage
667	Kia	Stinger
668	Kia	Stonic
669	Kia	Telluride
670	Kia	Venga
671	Lamborghini	Aventador
672	Lamborghini	Centenario
673	Lamborghini	Diablo
674	Lamborghini	Gallardo
675	Lamborghini	Huracan
676	Lamborghini	Murcielago
677	Lamborghini	Reventon
678	Lamborghini	Urus
679	Lancia	Delta
680	Lancia	Lybra
681	Lancia	Musa
682	Lancia	Phedra
683	Lancia	Thema
684	Lancia	Thesis
685	Lancia	Ypsilon
686	Land Rover	Defender
687	Land Rover	Discovery
688	Land Rover	Discovery Sport
689	Land Rover	Evoque
690	Land Rover	Freelander
691	Land Rover	Range Rover
692	Land Rover	Range Rover Sport
693	Land Rover	Range Rover Velar
694	Lexus	CT
695	Lexus	ES
696	Lexus	GS
697	Lexus	GX
698	Lexus	HS
699	Lexus	IS
700	Lexus	LC
701	Lexus	LFA
702	Lexus	LM
703	Lexus	LS
704	Lexus	LX
705	Lexus	NX
706	Lexus	RC
707	Lexus	RC F
708	Lexus	RX
709	Lexus	SC
710	Lexus	UX
711	Lifan	Breez
712	Lifan	Cebrium
713	Lifan	Celliya
714	Lifan	Smily
715	Lifan	Solano
716	Lifan	X50
717	Lifan	X60
718	Lincoln	Aviator
719	Lincoln	Corsair
720	Lincoln	Mark LT
721	Lincoln	MKC
722	Lincoln	MKS
723	Lincoln	MKT
724	Lincoln	MKX
725	Lincoln	MKZ
726	Lincoln	Nautilus
727	Lincoln	Navigator
728	Lincoln	Town Car
729	Lincoln	Zephyr
730	Lotus	Elise
731	Lotus	Europa S
732	Lotus	Evora
733	Lotus	Exige
734	Marussia	B1
735	Marussia	B2
736	Maserati	3200 GT
737	Maserati	Ghibli
738	Maserati	Gran Cabrio
739	Maserati	Gran Turismo 
740	Maserati	Gran Turismo S
741	Maserati	Levante
742	Maserati	MC20
743	Maserati	Quattroporte
744	Maserati	Quattroporte S
745	Maybach	57
746	Maybach	57 S
747	Maybach	62
748	Maybach	62 S
749	Maybach	Landaulet
750	Mazda	2
751	Mazda	3
752	Mazda	323
753	Mazda	5
754	Mazda	6
755	Mazda	626
756	Mazda	B-Series
757	Mazda	BT-50
758	Mazda	CX-3
759	Mazda	CX-30
760	Mazda	CX-5
761	Mazda	CX-7
762	Mazda	CX-8
763	Mazda	CX-9
764	Mazda	MPV
765	Mazda	MX-30
766	Mazda	MX-5
767	Mazda	Premacy
768	Mazda	RX-7
769	Mazda	RX-8
770	Mazda	Tribute
771	McLaren	540C
772	McLaren	570S
773	McLaren	600LT
774	McLaren	650S
775	McLaren	675LT
776	McLaren	720S
777	McLaren	720S Spider
778	McLaren	765LT
779	McLaren	Artura
780	McLaren	MP4-12C
781	McLaren	P1
782	Mercedes	A-class
783	Mercedes	AMG GT
784	Mercedes	AMG GT 4-Door
785	Mercedes	B-class
786	Mercedes	C-class
787	Mercedes	C-class Sport Coupe
788	Mercedes	Citan
789	Mercedes	CL-class
790	Mercedes	CLA-class
791	Mercedes	CLC-class 
792	Mercedes	CLK-class
793	Mercedes	CLS-class
794	Mercedes	E-class
795	Mercedes	E-class Coupe
796	Mercedes	EQA
797	Mercedes	EQB
798	Mercedes	EQC
799	Mercedes	EQS
800	Mercedes	EQV
801	Mercedes	G-class
802	Mercedes	GL-class
803	Mercedes	GLA-class
804	Mercedes	GLB-class
805	Mercedes	GLC-class
806	Mercedes	GLC-class Coupe
807	Mercedes	GLE-class
808	Mercedes	GLE-class Coupe
809	Mercedes	GLK-class
810	Mercedes	GLS-class
811	Mercedes	M-class
812	Mercedes	R-class
813	Mercedes	S-class
814	Mercedes	S-class Cabrio
815	Mercedes	S-class Coupe
816	Mercedes	SL-class
817	Mercedes	SLC-class
818	Mercedes	SLK-class
819	Mercedes	SLR-class
820	Mercedes	SLS AMG
821	Mercedes	Sprinter
822	Mercedes	Vaneo
823	Mercedes	Viano
824	Mercedes	Vito
825	Mercedes	X-class
826	Mercury	Grand Marquis
827	Mercury	Mariner
828	Mercury	Milan
829	Mercury	Montego
830	Mercury	Monterey
831	Mercury	Mountaineer
832	Mercury	Sable
833	MG	Hector
834	MG	TF
835	MG	XPower SV
836	MG	ZR
837	MG	ZS
838	MG	ZT
839	MG	ZT-T
840	Mini	Clubman
841	Mini	Clubman S
842	Mini	Clubvan
843	Mini	Cooper
844	Mini	Cooper Cabrio
845	Mini	Cooper S
846	Mini	Cooper S Cabrio
847	Mini	Cooper S Countryman All4
848	Mini	Countryman
849	Mini	One
850	Mitsubishi	3000 GT
851	Mitsubishi	ASX
852	Mitsubishi	Carisma
853	Mitsubishi	Colt
854	Mitsubishi	Dignity
855	Mitsubishi	Eclipse
856	Mitsubishi	Eclipse Cross
857	Mitsubishi	Endeavor
858	Mitsubishi	Galant
859	Mitsubishi	Grandis
860	Mitsubishi	i-MiEV
861	Mitsubishi	L200
862	Mitsubishi	Lancer
863	Mitsubishi	Lancer Evo
864	Mitsubishi	Mirage
865	Mitsubishi	Outlander
866	Mitsubishi	Outlander Sport
867	Mitsubishi	Outlander XL
868	Mitsubishi	Pajero
869	Mitsubishi	Pajero Pinin
870	Mitsubishi	Pajero Sport
871	Mitsubishi	Raider
872	Mitsubishi	Space Gear
873	Mitsubishi	Space Runner
874	Mitsubishi	Space Star
875	Mitsubishi	Xpander
876	Nissan	350Z
877	Nissan	370Z
878	Nissan	Almera
879	Nissan	Almera Classic
880	Nissan	Almera Tino
881	Nissan	Altima
882	Nissan	Ariya
883	Nissan	Armada
884	Nissan	Bluebird Sylphy
885	Nissan	Frontier
886	Nissan	GT-R
887	Nissan	Juke
888	Nissan	Leaf
889	Nissan	Maxima
890	Nissan	Micra
891	Nissan	Murano
892	Nissan	Navara
893	Nissan	Note
894	Nissan	NP300
895	Nissan	Pathfinder
896	Nissan	Patrol
897	Nissan	Primera
898	Nissan	Qashqai
899	Nissan	Qashqai+2
900	Nissan	Quest
901	Nissan	Rogue
902	Nissan	Sentra
903	Nissan	Skyline
904	Nissan	Sylphy
905	Nissan	Teana
906	Nissan	Terrano
907	Nissan	Tiida
908	Nissan	Titan
909	Nissan	Titan XD
910	Nissan	X-Trail
911	Nissan	XTerra
912	Nissan	Z
913	Noble	M600
914	Opel	Adam
915	Opel	Agila
916	Opel	Ampera-e
917	Opel	Antara
918	Opel	Astra
919	Opel	Astra GTC
920	Opel	Astra OPC
921	Opel	Cascada
922	Opel	Combo
923	Opel	Corsa
924	Opel	Corsa OPC
925	Opel	Crossland
926	Opel	Crossland X
927	Opel	Frontera
928	Opel	Grandland X
929	Opel	Insignia
930	Opel	Insignia OPC
931	Opel	Karl
932	Opel	Meriva
933	Opel	Mokka
934	Opel	Omega
935	Opel	Signum
936	Opel	Speedster
937	Opel	Tigra
938	Opel	Vectra
939	Opel	Vivaro
940	Opel	Zafira
941	Opel	Zafira Life
942	Opel	Zafira Tourer
943	Peugeot	1007
944	Peugeot	107
945	Peugeot	108
946	Peugeot	2008
947	Peugeot	206
948	Peugeot	207
949	Peugeot	208
950	Peugeot	3008
951	Peugeot	301
952	Peugeot	307
953	Peugeot	308
954	Peugeot	4007
955	Peugeot	4008
956	Peugeot	406
957	Peugeot	407
958	Peugeot	408
959	Peugeot	5008
960	Peugeot	508
961	Peugeot	607
962	Peugeot	807
963	Peugeot	Boxer
964	Peugeot	Expert
965	Peugeot	Landtrek
966	Peugeot	Partner
967	Peugeot	RCZ Sport
968	Peugeot	Rifter
969	Peugeot	Traveller
970	Plymouth	Road Runner
971	Pontiac	Aztec
972	Pontiac	Bonneville
973	Pontiac	Firebird
974	Pontiac	G5 Pursuit
975	Pontiac	G6
976	Pontiac	G8
977	Pontiac	Grand AM
978	Pontiac	Grand Prix
979	Pontiac	GTO
980	Pontiac	Montana
981	Pontiac	Solstice
982	Pontiac	Sunfire
983	Pontiac	Torrent
984	Pontiac	Vibe
985	Porsche	718 Boxster
986	Porsche	718 Cayman
987	Porsche	911
988	Porsche	Boxster
989	Porsche	Cayenne
990	Porsche	Cayman
991	Porsche	Macan
992	Porsche	Panamera
993	Porsche	Taycan
994	Ravon	Gentra
995	Renault	Alaskan
996	Renault	Arkana
997	Renault	Avantime
998	Renault	Captur
999	Renault	Clio
1000	Renault	Duster
1001	Renault	Duster Oroch
1002	Renault	Espace
1003	Renault	Fluence
1004	Renault	Grand Scenic
1005	Renault	Kadjar
1006	Renault	Kangoo
1007	Renault	Kaptur
1008	Renault	Kiger
1009	Renault	Koleos
1010	Renault	Laguna
1011	Renault	Latitude
1012	Renault	Logan
1013	Renault	Logan Stepway
1014	Renault	Master
1015	Renault	Megane
1016	Renault	Modus
1017	Renault	Sandero
1018	Renault	Sandero Stepway
1019	Renault	Scenic
1020	Renault	Symbol
1021	Renault	Taliant
1022	Renault	Talisman
1023	Renault	Trafic
1024	Renault	Triber
1025	Renault	Twingo
1026	Renault	Twizy
1027	Renault	Vel Satis
1028	Renault	Wind
1029	Renault	Zoe
1030	Rolls-Royce	Cullinan
1031	Rolls-Royce	Dawn
1032	Rolls-Royce	Ghost
1033	Rolls-Royce	Phantom
1034	Rolls-Royce	Wraith
1035	Rover	25
1036	Rover	400
1037	Rover	45
1038	Rover	600
1039	Rover	75
1040	Rover	Streetwise
1041	Saab	9-2x
1042	Saab	09.мар
1043	Saab	9-4x
1044	Saab	09.май
1045	Saab	9-7x
1046	Saturn	Aura
1047	Saturn	Ion
1048	Saturn	LW
1049	Saturn	Outlook
1050	Saturn	Sky
1051	Saturn	Vue
1052	Scion	FR-S
1053	Scion	tC
1054	Scion	xA
1055	Scion	xB
1056	Scion	xD
1057	Seat	Alhambra
1058	Seat	Altea
1059	Seat	Altea Freetrack
1060	Seat	Altea XL
1061	Seat	Arona
1062	Seat	Arosa
1063	Seat	Ateca
1064	Seat	Cordoba
1065	Seat	Exeo
1066	Seat	Ibiza
1067	Seat	Leon
1068	Seat	Mii
1069	Seat	Tarraco
1070	Seat	Toledo
1071	Skoda	Citigo
1072	Skoda	Enyaq iV
1073	Skoda	Fabia
1074	Skoda	Felicia
1075	Skoda	Kamiq
1076	Skoda	Karoq
1077	Skoda	Kodiaq
1078	Skoda	Octavia
1079	Skoda	Octavia Scout
1080	Skoda	Octavia Tour
1081	Skoda	Praktik
1082	Skoda	Rapid
1083	Skoda	Rapid Spaceback (NH1)
1084	Skoda	Roomster
1085	Skoda	Scala
1086	Skoda	Superb
1087	Skoda	Yeti
1088	Smart	Forfour
1089	Smart	Fortwo
1090	Smart	Roadster
1091	Ssang Yong	Actyon
1092	Ssang Yong	Actyon Sports
1093	Ssang Yong	Chairman
1094	Ssang Yong	Korando
1095	Ssang Yong	Kyron
1096	Ssang Yong	Musso
1097	Ssang Yong	Musso Grand
1098	Ssang Yong	Musso Sport
1099	Ssang Yong	Rexton
1100	Ssang Yong	Rexton Sports
1101	Ssang Yong	Rodius
1102	Ssang Yong	Stavic
1103	Ssang Yong	Tivoli
1104	Ssang Yong	Tivoli Grand
1105	Ssang Yong	XLV
1106	Subaru	Ascent
1107	Subaru	Baja
1108	Subaru	BRZ
1109	Subaru	Crosstrack
1110	Subaru	Exiga
1111	Subaru	Forester
1112	Subaru	Impreza
1113	Subaru	Justy
1114	Subaru	Legacy
1115	Subaru	Levorg
1116	Subaru	Outback
1117	Subaru	Traviq
1118	Subaru	Tribeca
1119	Subaru	WRX
1120	Subaru	XV
1121	Suzuki	Alto
1122	Suzuki	Baleno
1123	Suzuki	Celerio
1124	Suzuki	Ciaz
1125	Suzuki	Ertiga
1126	Suzuki	Grand Vitara
1127	Suzuki	Grand Vitara XL7
1128	Suzuki	Ignis
1129	Suzuki	Jimny
1130	Suzuki	Kizashi
1131	Suzuki	Liana
1132	Suzuki	S-Presso
1133	Suzuki	Splash
1134	Suzuki	Swift
1135	Suzuki	SX4
1136	Suzuki	Vitara
1137	Suzuki	Wagon R
1138	Suzuki	Wagon R+
1139	Suzuki	XL6
1140	Suzuki	XL7
1141	Tesla	Model 3
1142	Tesla	Model S
1143	Tesla	Model X
1144	Tesla	Model Y
1145	Toyota	4Runner
1146	Toyota	Alphard
1147	Toyota	Auris
1148	Toyota	Avalon
1149	Toyota	Avensis
1150	Toyota	Avensis Verso
1151	Toyota	Aygo
1152	Toyota	C+pod
1153	Toyota	C-HR
1154	Toyota	Caldina
1155	Toyota	Camry
1156	Toyota	Celica
1157	Toyota	Corolla
1158	Toyota	Corolla Verso
1159	Toyota	FJ Cruiser
1160	Toyota	Fortuner
1161	Toyota	GT 86
1162	Toyota	Hiace
1163	Toyota	Highlander
1164	Toyota	Hilux
1165	Toyota	iQ
1166	Toyota	ist
1167	Toyota	Land Cruiser
1168	Toyota	Land Cruiser Prado
1169	Toyota	Mark II
1170	Toyota	Mirai
1171	Toyota	MR2
1172	Toyota	Picnic
1173	Toyota	Previa
1174	Toyota	Prius
1175	Toyota	Prius Prime
1176	Toyota	RAV4
1177	Toyota	Sequoia
1178	Toyota	Sienna
1179	Toyota	Supra
1180	Toyota	Tacoma
1181	Toyota	Tundra
1182	Toyota	Venza
1183	Toyota	Verso
1184	Toyota	Vitz
1185	Toyota	Yaris
1186	Toyota	Yaris Verso
1187	UAZ	Pickup
1188	UAZ	РџР°С‚СЂРёРѕС‚
1189	UAZ	РҐР°РЅС‚РµСЂ
1190	VAZ	2101-2107
1191	VAZ	2108, 2109, 21099
1192	VAZ	2110, 2111, 2112
1193	VAZ	2113, 2114, 2115
1194	VAZ	4x4 Urban
1195	VAZ	Granta
1196	VAZ	Granta Cross
1197	VAZ	Largus
1198	VAZ	Largus Cross
1199	VAZ	Niva Legend
1200	VAZ	Niva Travel
1201	VAZ	Vesta Cross
1202	VAZ	Vesta Sport
1203	VAZ	Vesta SW
1204	VAZ	XRay
1205	VAZ	XRay Cross
1206	VAZ	Р’РµСЃС‚Р°
1207	VAZ	РљР°Р»РёРЅР°
1208	VAZ	РќРёРІР° 4X4
1209	VAZ	РћРєР°
1210	VAZ	РџСЂРёРѕСЂР°
1211	Volkswagen	Amarok
1212	Volkswagen	Arteon
1213	Volkswagen	Beetle
1214	Volkswagen	Bora
1215	Volkswagen	Caddy
1216	Volkswagen	CC
1217	Volkswagen	Crafter
1218	Volkswagen	CrossGolf
1219	Volkswagen	CrossPolo
1220	Volkswagen	CrossTouran
1221	Volkswagen	Eos
1222	Volkswagen	Fox
1223	Volkswagen	Golf
1224	Volkswagen	ID.4
1225	Volkswagen	Jetta
1226	Volkswagen	Lupo
1227	Volkswagen	Multivan
1228	Volkswagen	New Beetle
1229	Volkswagen	Passat
1230	Volkswagen	Passat CC
1231	Volkswagen	Phaeton
1232	Volkswagen	Pointer
1233	Volkswagen	Polo
1234	Volkswagen	Routan
1235	Volkswagen	Scirocco
1236	Volkswagen	Sharan
1237	Volkswagen	T-Roc
1238	Volkswagen	Taos
1239	Volkswagen	Teramont
1240	Volkswagen	Tiguan
1241	Volkswagen	Touareg
1242	Volkswagen	Touran
1243	Volkswagen	Transporter
1244	Volkswagen	Up
1245	Volvo	C30
1246	Volvo	C40
1247	Volvo	C70
1248	Volvo	C70 Convertible
1249	Volvo	C70 Coupe
1250	Volvo	S40
1251	Volvo	S60
1252	Volvo	S70
1253	Volvo	S80
1254	Volvo	S90
1255	Volvo	V40
1256	Volvo	V50
1257	Volvo	V60
1258	Volvo	V70
1259	Volvo	V90
1260	Volvo	XC40
1261	Volvo	XC60
1262	Volvo	XC70
1263	Volvo	XC90
\.


--
-- Data for Name: persons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.persons (id, firstname, secondname, lastname, birthdate, passportser, passportnum, passportdate, address, aparts) FROM stdin;
1	\N	\N	\N	\N	\N	\N	\N	\N	\N
83	Валентина	Петровна	Георгиева	2000-02-06	1234	253424	2010-05-02	г Санкт-Петербург, ул Александра Блока, д 3	6
82	Петр	Степанович	Георгиев	1986-06-02	3340	345345	2014-10-05	г Красноярск, пр-кт Мира, д 130	146
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, type) FROM stdin;
1	Осаго
2	Каско
3	Техосмотр
4	Консульт
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, token, name, email, hash_pwd, role, documents) FROM stdin;
28	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5tYXNoaW5hQG1haWwucnUiLCJpYXQiOjE2NTM1NjUxMTcsImV4cCI6MTY1MzU2ODcxN30.WA26lszbUSWpn5ymd7UMGK0yLTC1xAlVl-TBl4jWPUw	Петр	johnmashina@mail.ru	$2b$04$3iuDlATkH0eutc30c1xbye15CPtk9U9e8Chb544TbPKwwj3FduWNS	1	\N
30	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ijg5Mjk0Mzg0NjY2QHlhLnJ1IiwiaWF0IjoxNjUzNzM2NzczLCJleHAiOjE2NTM3NDAzNzN9.bSM1SKaKXSgWp2GzihXSK0SLHSaTsflAhkzJPUyH5ww	Андрей	89294384666@ya.ru	$2b$04$6.LyYH/6CAmuRdqnEUQsLeiKKK/06eoyhy1XP39CR75XGFILsyIwa	0	\N
\.


--
-- Name: clients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clients_id_seq', 22, true);


--
-- Name: docs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.docs_id_seq', 40, true);


--
-- Name: models_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.models_id_seq', 1263, true);


--
-- Name: persons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.persons_id_seq', 83, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 30, true);


--
-- Name: carcats carcats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carcats
    ADD CONSTRAINT carcats_pkey PRIMARY KEY (value);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: docs docs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docs
    ADD CONSTRAINT docs_pkey PRIMARY KEY (id);


--
-- Name: idtypes idtypes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.idtypes
    ADD CONSTRAINT idtypes_pkey PRIMARY KEY (value);


--
-- Name: models models_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_pkey PRIMARY KEY (id);


--
-- Name: persons persons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persons
    ADD CONSTRAINT persons_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: clients clients_carcat_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_carcat_fkey FOREIGN KEY (carcat) REFERENCES public.carcats(value);


--
-- Name: clients clients_idtype_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_idtype_fkey FOREIGN KEY (idtype) REFERENCES public.idtypes(value);


--
-- Name: clients clients_model_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_model_fkey FOREIGN KEY (model) REFERENCES public.models(id);


--
-- Name: clients clients_service_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_service_fkey FOREIGN KEY (service) REFERENCES public.services(id);


--
-- Name: clients clients_sobstvennik_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_sobstvennik_fkey FOREIGN KEY (sobstvennik) REFERENCES public.persons(id);


--
-- Name: clients clients_strahovatel_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_strahovatel_fkey FOREIGN KEY (strahovatel) REFERENCES public.persons(id);


--
-- Name: docs docs_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docs
    ADD CONSTRAINT docs_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

