### **Projektdokumentation: Interaktive Portfolio-Webseite**

**Version:** 0.2
**Datum:** 21.09.2025

#### **1. Projektvision & Kernkonzept**

**(Unverändert)**

**Projektname:** Interaktiver Lebenslauf Carl Vogler

**Vision:** Eine einzigartige, interaktive Portfolio-Webseite, die den beruflichen Werdegang und die Projekte von Carl Vogler präsentiert. Die Seite bricht mit traditionellen Layouts und nutzt stattdessen eine retro-futuristische "Computer-Terminal"-Ästhetik.

**Kernkonzept:** Das zentrale Feature ist eine interaktive Karte (basierend auf Leaflet.js), die als visuelle Ergänzung zu den textlichen Inhalten dient. Aktionen des Benutzers in der Benutzeroberfläche (UI) lösen dynamische Reaktionen auf der Karte aus, um einen geografischen und stadtplanerischen Kontext zu den Lebenslauf- und Projektstationen herzustellen.

**Technologie-Stack:**
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
*   **Kartografie:** Leaflet.js, QGIS (zur Datenaufbereitung)
*   **Datenformat:** GeoJSON

---

#### **2. Seitenstruktur & Funktionalität**

**(Aktualisiert in Sektion 2.2)**

Die Webseite ist als Single-Page-Application (SPA) konzipiert. Inhalte werden dynamisch in die Sidebar geladen.

*   **2.1. HOME (Startseite)**
    *   **Konzept:** Dient als atmosphärischer Einstiegspunkt und Hauptmenü. Zeigt eine simulierte Boot-Sequenz. Beinhaltet die Hauptnavigation.
    *   **Kartenintegration:** Zeigt eine initiale, neutrale Kartenansicht mit Markern für globale Schlüsselorte (z.B. Magdeburg, Sydney).

*   **2.2. LEBENSLAUF**
    *   **Konzept:** Detaillierte Auflistung des beruflichen Werdegangs. Jeder relevante Eintrag ist ein interaktives Element.
    *   **Kartenintegration:** Dies ist die **zentrale, vielschichtige Interaktion**:
        *   Ein Klick auf einen Listeneintrag zentriert die Karte auf die hinterlegten Koordinaten.
        *   Der GeoJSON-Layer für das Hauptgebäude wird eingeblendet und hervorgehoben. Ein Popup mit Basis-Infos öffnet sich.
        *   **Gleichzeitig** werden relevante kontextuelle GeoJSON-Layer (z.B. ÖPNV-Haltestellen, Flächennutzung, fußläufiger Radius, städtebaulicher Wandel) dynamisch für die unmittelbare Umgebung geladen und visualisiert, um einen tiefen Einblick in den stadtplanerischen Kontext des Standorts zu geben.

*   **2.3. PROJEKTE > WEB / GIS**
    *   **(Unverändert)**

*   **2.4. KONTAKT**
    *   **(Unverändert)**

---

#### **3. Definition der Benutzeroberfläche (UI)**

**(Unverändert)**

---

#### **4. Datenstruktur & Attribut-Definitionen**

**(Neu und Detailliert)**

Die saubere Definition der Attribute ist entscheidend für die Funktionalität. Die folgenden Tabellen dienen als Vorlage für die Aufbereitung in QGIS.

*   **4.1 Haupt-Layer: Lebenslauf**
    *   **Datei:** `lebenslauf_orte.geojson` | **Geometrie:** `Polygon`
| Feldname | Datentyp | Beschreibung |
| :--- | :--- | :--- |
| `name` | String | **Schlüssel:** Exakter Name des Ortes (z.B. "Landesfunkhaus des MDR"). Muss mit `data-name` im HTML übereinstimmen. |
| `ort` | String | Stadt (z.B. "Magdeburg"). Wird genutzt, um die richtigen Kontext-Layer zu laden. |
| `typ` | String | Kategorie (z.B. "Arbeit", "Studium"). Für Styling. |

*   **4.2 Kontext-Layer: Lebenslauf-Umgebung (Beispiel Magdeburg)**
    *   **Datei:** `kontext_pois_md.geojson` | **Geometrie:** `Point`
| Feldname | Datentyp | Beschreibung |
| :--- | :--- | :--- |
| `name` | String | Name des POI (z.B. "Stadtpark"). |
| `typ` | String | Kategorie für Icons (z.B. `haltestelle_tram`, `cafe`). |
| `linien`| String | (Nur für Haltestellen) Linien (z.B. "2, 8"). |
| `bezug_zu`| String | **Verknüpfung:** Der `name` des Hauptortes aus `lebenslauf_orte.geojson`. |
| `entfernung_m`| Integer | (Optional) Vorberechnete Entfernung zum Hauptort. |

    *   **Datei:** `kontext_nutzung_md.geojson` | **Geometrie:** `Polygon`
| Feldname | Datentyp | Beschreibung |
| :--- | :--- | :--- |
| `nutzung_typ` | String | Nutzungskategorie (z.B. "Gewerbe", "Wohnen", "Grünfläche"). Für die Farbcodierung. |
| `bezug_zu` | String | **Verknüpfung:** Der `name` des Hauptortes. |

    *   **Datei:** `analyse_gehbereich_md.geojson` | **Geometrie:** `Polygon`
| Feldname | Datentyp | Beschreibung |
| :--- | :--- | :--- |
| `bezug_zu`| String | **Verknüpfung:** Der `name` des Hauptortes. |
| `radius_min`| Integer | Radius in Gehminuten (z.B. 5). |

---

#### **5. Anwendungsfall / User Story: Interaktion im Lebenslauf**

**(Neu)**

Dieses Szenario beschreibt den genauen Ablauf und das Zusammenspiel aller Komponenten bei einer typischen Benutzeraktion.

*   **Trigger:** Der Nutzer klickt in der `lebenslauf.html` auf den Listeneintrag "MDR Sachsen-Anhalt", der das `data-name`-Attribut "Landesfunkhaus des MDR" trägt.

*   **Verarbeitung & Logik:**
    1.  Das Skript liest `data-name` ("Landesfunkhaus des MDR") als primären Schlüssel.
    2.  Die Karte wird auf die zugehörigen Koordinaten zentriert und gezoomt.
    3.  Alle GeoJSON-Layer werden nach dem Schlüssel "Landesfunkhaus des MDR" gefiltert.
    4.  Die gefilterten Features werden auf der Karte mit vordefinierten Stilen (Farben, Icons, Transparenz) gerendert.

*   **Ergebnis auf dem Bildschirm:**
    *   **Hauptobjekt:** Der Umriss des **Landesfunkhauses** ist hervorgehoben und sein Haupt-Popup ist geöffnet.
    *   **Kontext-Informationen:** Die Karte ist angereichert mit:
        *   **Icons** für nahegelegene Tram- und Bushaltestellen (`kontext_pois_md.geojson`).
        *   **Farbigen, transparenten Flächen**, welche die umliegende Flächennutzung zeigen (der Stadtpark als Grünfläche, Wohngebiete etc. aus `kontext_nutzung_md.geojson`).
        *   Einem **großen, transparenten Polygon**, das den 5-Minuten-Gehbereich visualisiert (`analyse_gehbereich_md.geojson`).
    *   **Sidebar:** Der geklickte Listeneintrag ist farblich markiert.

*   **Zusammenfassung der Datenströme für diesen Klick:**
| Datei | Geladene Information (selektiert durch "Landesfunkhaus des MDR") | Sichtbares Ergebnis auf der Karte |
| :--- | :--- | :--- |
| `lebenslauf_orte.geojson` | Das Polygon-Feature, dessen `name`-Attribut übereinstimmt. | Der hervorgehobene Umriss des Gebäudes + Haupt-Popup. |
| `kontext_pois_md.geojson` | Alle Point-Features, deren `bezug_zu`-Attribut übereinstimmt. | Icons für Tram- und Bushaltestellen mit Detail-Popups. |
| `kontext_nutzung_md.geojson`| Alle Polygon-Features, deren `bezug_zu`-Attribut übereinstimmt. | Farbige Overlays für "Grünfläche", "Wohnen" etc. |
| `analyse_gehbereich_md.geojson`| Das Polygon-Feature, dessen `bezug_zu`-Attribut übereinstimmt. | Der transparente "Walkability"-Kreis um den Standort. |