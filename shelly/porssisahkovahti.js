// Pörssisähkövahti Shelly-skripti (Shelly Plus / Pro, Script-toiminto).
// Kytkee releen 0 päälle, kun halvin 4 tunnin jakso on käynnissä, ja pois muulloin.
// Hinnat: https://porssisahkovahti.fi/api (ilmainen, lähdemaininta). Testaa ennen tuotantokäyttöä.

let CONFIG = {
  tuntia: 4,          // halvimman jakson pituus tunteina (0,5–12)
  rele: 0,            // ohjattava switch-id
  tarkistusMin: 15,   // kuinka usein tarkistetaan (min)
};

function tarkista() {
  Shelly.call(
    "HTTP.GET",
    { url: "https://porssisahkovahti.fi/api/v1/halvimmat.json?tuntia=" + CONFIG.tuntia, timeout: 20 },
    function (res, err) {
      if (err !== 0 || !res || res.code !== 200) { print("Pörssisähkövahti: haku epäonnistui"); return; }
      let data = JSON.parse(res.body);
      if (!data || !data.jaksot || data.jaksot.length === 0) return;
      let j = data.jaksot[0];
      let paalle = j.kaynnissa_nyt === true;
      Shelly.call("Switch.Set", { id: CONFIG.rele, on: paalle });
      print("Pörssisähkövahti: halvin " + CONFIG.tuntia + " h jakso " + j.alkaa + "–" + j.paattyy + ", rele " + (paalle ? "päällä" : "pois"));
    }
  );
}

tarkista();
Timer.set(CONFIG.tarkistusMin * 60 * 1000, true, tarkista);
