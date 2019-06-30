________________________________________________________________________________________
________________________________________________________________________________________
2019.01.13(Vasárnap)

A kihagyott időszakban gyakorlati rendszerteszteket végeztünk el. Megvizsgáltuk, hogy különböző terhelésekre hogyan reagál a rendszer, ill.
a kutatóközponttal együttműködve éles cserepeket kötöttünk a rendszerre.

A program már készen áll az éles használatra (és egy verzióját már használják is), de még vannak apróságok, amiket célszerű megcsinálni.

Gateway-oldal:

	* Az éles verzión észre vettük, hogyha több cserepet (több, mint 8) rendelünk egy projekthez, és az adott projektnek vége van, akkor a
	befejezett projektek táblázatában (a 'finished projects' típusú nézetben) az okoscserep neveiket tartalmazó táblát elnyújtja a program.
	Ez a jelenleg folyó projektek nézetében le lett kezelve, azonban itt lefelejtettem. Ez lett kijavítva.

	* A kért kijelentkező gombot hozzáadtam a gombok menüjéhez, teljesen működik.




________________________________________________________________________________________
2018.10.23 (Kedd)

Gateway-oldal:

	* A Download gomb kliens és szerver-oldali működését is át kellett írni, hogy több szenzor adatával működjön.
	* (A legnehezebb része az volt, hogy az előre megírt rickshaw szenzor-kiválasztó panelre listenert kellett implementálni,
		de mivel olyan alapból nincs, írni kellett egy sajátot. A különleges működése miatt még az is nehézkes volt.)
	* A download gomb megnyomásakor a slider által beállított, szűrt adatokat kellett szűrni még egyszer, hiszen
	mostmár nem csak egy szenzor adatát kell egyszerűen kiírni egy fájlba, hanem a kiválasztottakból mindet. Emiatt a kód bonyolodott.
	* Jelenleg (elvileg) minden szenzor-variációra működnie kell, de ezt még tesztelni kell.

	** A dockeresítés még ma le fog zajlani, interneten elérhetővé válik az éles rendszeren a legfrissebb (ez) a gateway verzió.
________________________________________________________________________________________
2018.10.22 (Hétfő)

Gateway-oldal:

	* A mega-gráf rajzoló oldal teljesen újragondolva, a múlt heti találkozó/gyűlésen lezajlott megbeszélés alapján.

	* Félig le is lett implementálva:
		-> A mega-gráf mérete nagyobb lett
		-> A szenzor kiválasztó fül kitörölve, helyettesítve egy szenzor control panel-lel, melyben ki lehet választani
		a megjeleníteni kívánt szenzor típusokat,
		-> Több szenzor adatát képes a gráf egyszerre kirajzolni, a control panel alapján.
		-> A felső 3 nyil alapján a kód 60%-a át lett írva, emiatt apróbb kód-tisztítások.
		-> A hover-detail része a gráf-renderelőnek szépítve, modernebb kinézetet kapott.
________________________________________________________________________________________
2018.10.06 (Szombat)

Gateway-oldal:

* Vissza gomb hozzáadva a megagráf-rajzolós oldalhoz.

* A mega-gráf rajzolós oldalon a "download" gomb teljesen implementálva.

* Új mappa: users hozzáadva. Minden felhasználónak létrehoz a rendszer egy külön mappát itt bejelentkezéskor ha még nem létezik, és
ebbe a mappába lesz az a "data.txt" folyamatosan újrairva, melyet le lehet tölteni a felhasználóknak. A tartalma minden egyes újraíráskor 
változik attól függően, hogy mit választott ki a felhasználó a historical graph-on.

..És ezzel a II. mérföldkő hivatalosan is LEZÁRVA.
________________________________________________________________________________________
2018.09.29 (Péntek)

Tovább folytattam a historical gráf fejlesztését.

	Gateway-oldal:

	* A mega-gráf kiegészítve egy Y-tengellyel, mely az értékeket kiírja, melyek az adott szenzorhoz tartoznak.

	* A mega-gráf kiegészítve egy Slider-rel is, mellyel mostmár lehet változtatni az adott intervallumot, melyen a mért
	adatot szeretnénk kirajzolni.

	* Kivezetve a kiválasztott intervallum a szerver-oldalra, string és json konvertálással, hidden form taggal.

	Jövőbeli tervem szerint a 'Download' gombra kattintva, mely szintén most lett hozzáadva, fogja lekezelni a program
	a kapott adatokat. Visszakonvertálom majd dátumhelyesen, esetleg hozzáírom a mértékegységet, kikérem még a szenzor-típust is,
	és kiírom egy .csv fájlba.

	Ehhez majd először egy fájlt kell létrehozni, és ha az kész, beleírom ezt az adatot amit kapok a kliens-oldaltól egy az egyben. 

________________________________________________________________________________________
2018.09.21 (Péntek)

A héten sor került egy megbeszélésre, melyben tisztázódott pár dolog az eddigiekkel kapcsolatban:

II. mérföldkő:

	Gateway-oldal:
		!-- A megbeszélésen közös ötletelés alapján úgy döntöttünk, újragondoljuk a gráf-megjelenítést. Szenzoronkénti
		7 darab gráf helyett 1 darab gráf lesz az oldalon, és két kiválasztó elemmel lehet az eszköz nevét és a szenzor nevét is,
		melyet kirajzolva szeretnének látni. [Az eredetiben az eszközöket szenzoronként lehetett kiválasztani.]

		* A két kiválasztó implementálva, iterativan feltöltik magukat az opciókkal.
		
		* Mega-gráf összekötése minden egyes esetre leimplementálva. Gráf-renderelés csak akkor indul el,
		ha mind a két szűrőfeltételt kiválasztottuk. Különböző színekkel, nevekkel, és mértékegységekkel vannak
		kirajzolva, minden egyes esetre.


________________________________________________________________________________________

2018.09.14 (Péntek)

A II. mérföldkő fejlesztése javában zajlik.

	Gateway-oldal:
		* A hőmérséklet-gráf szinte teljesen átfejlesztve. A kapott nyersadatokhoz mostmár hozzá lesz rendelve az eszköz is,
			mely az adott mérést elvégezte azon felül, hogy a projektet is kiolvassuk és hozzáirjuk.

		* Az első pont hatására lehetségessé vált olyan + szűrés megírása, mely úgy rendereli le újra a gráfot, hogy csak
			az adott eszköztől kapott adatokat látjuk (Egy projekthez ugye több eszköz is tartozhat.)

		* Az időcsúszka reagál az újra renderelésre.

	A terv az, hogy ezt az első gráfot fejlesztem csak át bizonyos helyeken, és ha teljesen kész van, a többit ez alapján könnyebben implemen-
	tálom.
	

	Szerver-oldal:

		* Az új listenert majd fel kell tenni a szerverre, amelyikben már szerepel az eszköznév leolvasása is.


________________________________________________________________________________________

2018.08.28-2018.08.31. (Kedd-Péntek)

A dockeres verzió sikeresen felállítva.



________________________________________________________________________________________

2018.08.27 (Hétfő)

Szerver oldal:

	Elkészült az utolsó script, mely nem más, mint az mqtt listener script. Ez a script feliratkozik minden topicra, és
		mivel a topicnevek ugyan azok, mint az eszközök nevei, az alapján lefuttat egy adatbázis keresést, hogy az eszköznév
		jelenleg melyik projekthez van betársítva. Ha ez megvan, hozzárendeli a kapott adatokhoz a projektnevet, és úgy
		írja be az adatbázisba.
		
	Ennek hála lehet elkezdeni a második mérföldkövet, a projektnév alapú adatkeresést, és azokból a gráfépítést.

	Mindhárom script hamarosan fel lesz téve az MTA felhőbe.

________________________________________________________________________________________

2018.08.21 (Kedd)

Szerver oldal:

	Elkészült a második script is, amely a már elindult, de még nem végződött projekteket ellenőrzi dátum szerint.
		Ha később fut le a szkript, mint a projektek végdátuma, akkor lezárja automatikusan, és a raspberryket újra
		elérhetővé teszi/kitszitítja a projektből.


________________________________________________________________________________________

2018.08.15 (Szerda)

Gateway oldal:

	List projects-nél a "Start project" gomb backendje, frontendje, mindene törölve.
		(Projekteket inditani egy szkript fog a szerveren.)
		Helyette az End date bevezetve, mint kilistázott attribútum.

	Megindult a szerver-oldali cron-scriptek írása.


	

________________________________________________________________________________________

2018.08.13 (Hétfő)

Gateway oldal:

	- A Modify Project (elvileg) teljesen implementálva, a create project alapján. Create gomb helyett modify gomb van, és annak megfelelően működik.

		* Különböző hibákra hibaszűrés megírva (pl. ha módosítunk dátumot, akkor saját maga dátumát ne nézze, csak a többi, fix projekt dátuma alapján szűrjön ütközést.)

		A modify projekt is ugyan úgy Select2 és Datetimepicker js könyvtárakat használ, mint a create projekt. Lényeges különbség, hogy itt már csak fix, még el nem indított projek-
		teket lehet módosítani.

_________________________________________________________________________________________

2018.08.11 (Szombat)

Húh..

Gateway oldal:

	- A Select2 js könyvtár hozzáadva a frontendhez, és ennek megfelelően a projekt-logikát módosítani kellett, mert speciálisan adja át a könyvtár
		formattribútumon keresztül a kiválasztott dolgokat (1 kiválaszottt v. több kiválasztott)
			* (Link project, create project, list project módosítva emiatt)


	- A Create project menüpontra rá lett húzva teljesen a backend, még tesztelésre szorul, de az alapdolgok szűrve vannak:
			* Üresen nem lehet hagyni egyetlen boxot sem. A select2 könyvtár miatt a required-et nem adhatjuk hozzá a speciális boxokhoz.
			    Ezt csak backenden lehet szűrni.

			* A kezdődátumnak meg kell előznie a végdátumot. Az eddig ideiglenesen szüneteltetett js könyvtár (datetimepicker) újra használatba lett téve
				az előző frontend újításkor, erre a backended ismét implementálni kellett.
			  A végdátum módosítja magát attól függően, hogy mi a kiválasztott kezdődátum (letiltja az azelőtti napokat.)

			* Azonos projektnevek kiszűrését újra kellett implementálni, ismét a könyvtár miatt.

	- A működés, miszerint eszközönként végignézi az összes projekt eszközlistáját úgy, hogy kiszűrje azokat a projekteket, ahol eszköznévütközés van, és
		azon belül ellenőrizze azt, hogy a dátumintervallumok ne ütközzenek, implementálva lett.

	- Külön szerver-response-ok implementálva a következőkre:

		* Azonos projektnév
		* Hibatömb, mely tartalmazza az összes olyan projektnevek eszköznevenként, amellyel a megadott új projekt ütközne.
		* Hibás úrlap-kitöltés.

	Sajnos sok időt vett igénybe, mivel be kellett tanulni a kliens oldali js könyvtárak működését és használatát + kigondolni a dátumütközési logikát.




_________________________________________________________________________________________

2018.08.06 (hétfő)

Az előző héten megbeszélést folytattunk, hogy hogyan kellene módosítani az eddigi működést. Az ott elhangzottak alapján a következő változtatások történtek:

- Az alsó gombsor olyan gombsor lesz, melyet csak admin lát.

- A 'Link project' menüpont átnevezve 'Modify project'-re.

- Raspberry listázásnál egybe lett olvasztva a két listázási módszer. Lényegében egy oldalon lehet mindent megcsinálni, amit eddig a kettőn lehetett.

	* A 'delete device' módosítva, hogy ne csak akkor ne engedjen törölni, ha jelenleg dolgozik egy eszköz, hanem már akkor se, ha be van rendelve
	legalább egy projekthez. Csak akkor lehet törölni, ha nincs olyan projekt, amihez hozzá lett rendelve.

- Következőleg a modify project és create project menüpontok módosítása fog folyni.

- Ebben a verzióban, és majd innestől felfele (Az 1. mérföldkő temporáris mentésével ellentétben) már lokális DB sztringek vannak.
Ez azt jelenti, hogy ezeket a verziókat hiába szedjük innestől le és próbáljuk futtatni, a helyi gépen fogja keresni a mongoDB-t amely tökéletes
klónja az MTA szerveren lévőnek. Ha nincs ilyen, nem tudjuk futtatni majd, csak a forráskódot olvashatjuk ki.



_________________________________________________________________________________________

2018.07.30 (hétfő)

- Gombrendszer létrehozva a projekt listázásnál. Mostmár lehet váltogatni befejezett és még futó projektek között.

- A jogkör-rendszer végre él. Mindenki csak a saját projektjeit látja.

- Az olyan projekteket, amiknél az isOver és isStarted is 1-t kapott, befejezettnek tekintjük, és nem listázzuk ki az eredeti
listázásnál.

- Start és End date hozzáadva a projekt indításánál/befejezésénél.

- Ha olyan projektünk van, ami még nincs linkelve (üres a raspberry listája) akkor nem aktívak a Start/Stop gombok.

_________________________________________________________________________________________
Csütörtök - Péntek [2018.07.26-2018.07.27]

Csütörtök:

-Gateway:

 * A 'list project' menüpontnál a Start/Stop projekt gombok css-e megírva.
 
 * A Start project gomb teljesen implementálva, miután az update mechanizmusra rájöttem..


Péntek:

-Általános:

 * A projekt teljesen letisztítva a felesleges importoktól.
 
 * Tamás .gitignore.io tanácsát most sikerült megfogadni. 30 MB-ról ~800 KB-ra csökkent a commit-méret a .gitignore
   használata miatt.
   
 * Az eddigileg használt node packagek: 'express', 'express-session', 'mongoose', 'pug'. Mostmár 'npm install'-al tele-
   píteni kell ezeket a 'git clone'-ozott projekt mappájába a használathoz. A régi, mostmár hasztalan package-ek
   a kérések megváltozása miatt törlése kerültek (pl. 'json2csv' és 'fs' a fájlba íráshoz) a projektből és a programkódból
   is.

-Gateway:
   
 * Mostmár nem lehet olyan eszközt törölni, mely jelenleg dolgozik egy projekten.
 
 * Stop project gomb teljesen implementálva.
 
 * Start project mostantól kiszűri, hogy mikor lehet indítani egy projektet, meg mikor nem.

_________________________________________________________________________________________

Szerdai changelog (2018.07.25):

 * A gombok mostantól letiltódnak a főoldalon és a listázásnál, ha bármelyikre rákattint a felhasználó egyszer. Ez azért volt gáz, mert
  ha olyan gombot használunk, amelyre db operáció van kötve, és sokszor nyomjuk le kevés időn belül, kiakad a rendszer.

  ..mostmár idegbeteg-kutatóstabil a rendszer :)


 * A raspberry listázásnál a 'Partial list' listázás átírva, és mindkét listázás funkciója átgondolva.

  - A 'Partial list' mostantól olyan listázási módszer, amely minden olyan raspberryt kilistáz, amelyhez legalább egy projekt van társítva,
  mellé pedig az összes projektet, melyhez betársították.
  
  - A 'Full list' mostantól olyan listázási módszer, melynél az összes regisztrált eszközt a rendszerből kilistáz mindentől függetlenül, és mellé
  azt a projektet írja ki, amelyen a raspberry jelenleg dolgozik.
  (Technikailag tehát azt jelenti, hogy azt az egy projektet, amelynél az 'isStarted = true')
  Jelenlegi tesztadatokkal és funkciókkal ez lehetetlen. A funkció tesztelésére kézzel lett beírva a társított projekt.
  A funkció amely ezt be fogja állítani a "start project" és "end project" gombok lesznek a projekt listázásnál.

 * 'List projects' fülnél a 'Start Project' és 'End Project' gombok hozzáadva. Funkcióimplementálás a következő lépés.


 * Apróbb kódtisztítások, debug funkciók megírva. 


_________________________________________________________________________________________

Hétfő/Keddi changelog (2018.07.23 , 2018.07.24):

Hétfőn sajnos maintenance nap volt az MTA Cloudstacken, ez lassítja a fejlesztést.

 * A create project mostmár owner nélkül szúr be új projektet, minden más maradt.
 ( - Itt élesben egyszer rosszul jelent meg a tábla, nem tudni miért, az itteni gépen jelenleg jól működik. (?) )
  ( - Élesben az élő monitorozásos rész hibát írt, de a mosquitto újraindítása megoldotta a problémát.(?) )
  
 * Link projectnél a frontend készül. Hosszú raspi device nevek mostantól támogatva vannak. A checkbox ilyenkor feléjük kerül,
 annak érdekében hogy el lehessen olvasni a nevét. Ha irgatlan hosszú nevet írunk be, egy scroll segitségével végignézhetjük.
 
 
(Ezzel kell folytatni kedden:)

 * Link projektnél az owner beállítása fül hozzáadva, és táblásítva a megjelenítés, amely iteratívan növeli méretét attól függően,
   hogy mennyi raspberry bejegyzés van.

_________________________________________________________________________________________

2018.07.11 (Szerda):

A fontos kérdés/probléma megvitatásra került.
A mérföldkövek meg lettek határozva.

Gateway-program oldal:

* A megbeszéltek alapján új kollekció létrehozva, ide fognak majd létrehozni új eszközöket (egyenlőre raspi-knak vannak hívva, ha szeretnék,
át lehet nevezni okoscserépre.)

Eddigi raspik és egy új, még be nem társított raspi létrehozva az új kollekcióban tesztelés céljából. (Ezeket az új gateway funkciókkal ki
is lehet listáztatni).

Gateway-program oldal:

* A Session új változóval gyarapodott: 'listType', segédváltozó, mely elmenti és megmondja, hogy a 'List raspberries' menüpont alatt melyik
listázási módszert használta legutóbb. (Következő belépéskor a menübe is az fog maradni.) + A view engine ez alapján renderel.

* A 'List raspberries' egy új listázási móddal bővült, mely az új kollekcióból listáz ki minden egyes létező raspberryt (okoscserepet).
A kettő között lehet váltogatni úgy, hogy nem használ új linket felül, és 'megjegyzi' hogy melyik volt használva legutóbb.

* 3 új gomb, más-más css-el, hozzáadva a főoldalhoz (dashboard)

* Következőkben az első gombbal, a 'Create device' gombbal, és a hozzá tartozó pug/server-side/client-side js-el fogok dolgozni.

(Terv szerint ha az összes gomb implementálva lesz frontend/backend szerint, és admin tud indítani projektet a 'List projects' menüpont 
alatti Start és Stop mezőkkel, ideiglenesen le lehet zárni az első mérföldkövet, és megvitatni, hogy min kéne változtatni, mielőtt véglegesen
lezárjuk ezt a mérföldkő-részt.

!!!

- Mérföldkövek:

I. 1. Gateway program alap projekt-orientációs funkciók (pl. listázás) implementálása, jelenlegi felhő-rendszer átalakítása (elvileg kész)
I. 2. Jogkör-rendszer és projekt-menedzsment-rendszer teljes implementálása (jelenlegi)

II. Gráfok és Adatlekérdezés projekt-orientálttá tétele (következő)

III. SFTP projekt-orientálttá tétele) (távoli jövő)

!!!

________________________________________________________________________________

2018.07.10 (Kedd):

Gateway-program oldal:

- Két új menüpont hozzáadva, projektek és raspberryk listázása

	* Teljesen iteratív, és teljesen dinamikus, attól függően, hogy az adatbázisban milyen bejegyzések vannak.

	A Css az egyikre teljesen megírva, a másikon lehet, hogy még változtatok.

- Két új oldal létrehozva a gomboknak megfelelően, külön route-okkal.

	* A raspberryk abécéhelyes listázása, és a projektek listázása is teljes mértékben működik. De ezzel lesz egy
	probléma:


- A probléma:
	* Legutóbbi beszélgetésünkkor azt mondtad, hogy objektumorientáltan oldjam meg a raspberryket, egy kollekcióban.
	Ezalapján készítettem el ezt a sok updatet, de ezzel lesz egy probléma, majd ha kész lesz a program többi része is:
	
	Új projekt létrehozásánál nekik kell majd megadni (mondjuk vesszőkkel elválasztva) a raspberryk azonosítóját, amit hozzá
	szeretnének adni a projekthez. Nyilván levizsgálom, hogy adtak-e olyat meg amelyik már tartozik egy projekthez, és ha igen,
	akkor hibát dobatok, DE:

	Eredetileg azért akartam egy plusz kollekciót ugyan ebbe az adatbázisba (attól függetlenül, hogy 'redundáns'), mert ezzel a mostani
	raspi-lekérdezés is rengeteget egyszerűsödött volna, és gyorsabb is lenne. De az előző tárgyalásunk alapján az SZBK-val kikövetkeztethető, hogy ebbe
	tuti bele fognak kötni, hogy bonyolult, és azt fogják mondani, hogy szeretnének egy egyszerűbb (mondjuk checkboxos) kiválasztót.

	Ha ez így van, akkor ez azt jelenti, hogy kelleni fog egy plusz kollekció(tábla), ahol a létrehozott raspikat tároljuk, egy rendszer,
	amivel raspberryket lehet létrehozni a rendszerhez, és közte logika. A logika pedig az alapján generálja le a checkbox elemeket,
	hogy az új táblába a 'társitott projekt' mező melyik bejegyzésnél üres.

	Így már érdemes meggondolni, hogy megéri-e az a plusz kollekció.
	
_________________________________________________________________________________________

2018.07.06 (Péntek):

MTA-szerver oldal:

- Két új kollekció működése az új adatbázisban (SZBK-raspik)

	* Projekt_tarsitasok: Ennek a kollekciónak a segítségével tudja majd a subscriber script a szerveren, hogy a beérkezett
	json adathoz a hozzáadandó "Projektnév" attribútumot mire kell állítani, így tudunk majd hozzárendelni projektet a kapott
	adatstruktúrához anélkül, hogy a raspikon lévő kódhoz akár egyszer is hozzá kéne nyúlni.
	
	Ha új raspikat (okos-cserepeket) szeretnénk használni, annak a kódjába csak annyit kell átírni, hogy a raspi azonosítója
	legyen egyedi. Pl: "Raspi_2"-re át kell írni az eredeti kódban a "Raspi_1"-et. Ezután egy új kollekció-bejegyzést kell
	csinálni a kollekciókba (ezt akár webes felületen is meg lehet oldani) és kész is az új cserép beüzemelése.
	
	(Ha bróker-optimalizálást is szeretnénk, (tehát hogy külön topicba küldjön mindig minden egyes raspi) természetesen további
	beállítások szükségesek majd. De ezeket hardverileg csak a beüzemelés előtt kell egyszer megcsinálni a raspikon.) 
	
	A terv szerint a weboldalon majd új "cserepet" lehet létrehozni, és azokat hozzárendelni egy projekthez.
	
Gateway oldal:

- Login...

	*Remélem mostmár tényleg nem lesz vele probléma, az előzőben mindenre beengedett...
	
- Projektjeim gomb hozzáadva

	*Ezzel ki lehet listázni az olyan projekteket, amiknek a tulaja ténylegesen a bejelentkezett felhasználó.
	Csak a konzol-ablakba írja ki egyenlőre a dolgokat, innen kell majd folytatni.
_________________________________________________________________________________________

A 'Projektorientacio_v1' branch verzióban csak a projekt visszaállítását végezték el, hogy
felkészülhessen a projekt az adatlekérés teljes átalakítására. A rendszer jelenleg képes lenne
lekérni a dátum-alapú bejegyzéseket, de mivel az az adatbázis törlésre került a követelmények
megváltozása miatt, egy új működési elv megvalósítása szükséges.

A törlésen felül a mongoDB verziója a pesti szerveren teljes ujratelepítésre került a legú-
jabb, 4.0.0-s verzióra, az adatbázis-átszabás jelenleg folyik.

A v2-es branchen a módosítások csak akkor történnek, ha a pesti szervergépen az adatbázis
teljesen át lett alakítva, és felkészült az új szoftverrendszerrel való kommunikációra.
_________________________________________________________________________________________