'use strict';

/* BIO: Implementation note for this section. */
const IS_MOBILE = (() => {
  const coarse = matchMedia('(pointer: coarse)').matches;
  const narrow = matchMedia('(max-width: 820px)').matches;
  const ua     = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return coarse || (narrow && ua);
})();
if (IS_MOBILE && document.body) document.body.classList.add('is-mobile');

/** Ana a鑷抋鑾?etkile鑹me haz璋媟 m璋?閳?intro / splash kapand璋媖tan sonra true olur (Default Mode landscape ipucu vb.). */
let siteReady = false;

/* BIO: Implementation note for this section. */
const DATA = {
  label: { tr: ['\\u5468\\u5929\\u723d'], en: ['\\u5468\\u5929\\u723d'], de: ['\\u5468\\u5929\\u723d'] },
  nodes: [
    /* BIO: Implementation note for this section. */
    {
      id: 'about',
  label: { tr: ['\\u5468\\u5929\\u723d'], en: ['\\u5468\\u5929\\u723d'], de: ['\\u5468\\u5929\\u723d'] },
      color: '#ff6a00',
      subs: [
        {
          id: 'edu',
  label: { tr: ['\\u5468\\u5929\\u723d'], en: ['\\u5468\\u5929\\u723d'], de: ['\\u5468\\u5929\\u723d'] },
          title: { tr: 'E鑷戦檶T闄孧', en: 'EDUCATION', de: 'AUSBILDUNG' },
          html: {
            tr: `
            <div class="tl-wrap">
              <div class="tl-item active">
                <div class="tl-year">2024 閳?2027</div>
                <div class="tl-title">Yeditepe 鑴簄iversitesi</div>
                <div class="tl-desc">闄宯ternet ve A鑷?Teknolojileri</div>
              </div>
              <div class="tl-item">
                <div class="tl-year">2020 閳?2024</div>
                <div class="tl-title">G鐪夎幗 Karde鑹er Anadolu Lisesi</div>
                <div class="tl-desc">Lise E鑷抜timi</div>
              </div>
            </div>
            <hr class="divider">
            <div class="tl-section-title">Sertifikalar</div>
            <div class="tl-cert">
              <a href="https://learn.microsoft.com/en-us/users/bilalanl-8550/credentials/38e863aaef982a2d?ref=https%3A%2F%2Fwww.linkedin.com%2F" target="_blank" rel="noopener">Microsoft Certified: Fabric Data Engineer Associate (2026)</a>
              <a href="https://www.credly.com/badges/3852359e-8131-4422-9279-918a4f5c4c74" target="_blank" rel="noopener">Cisco AI Technical Practitioner (2026)</a>
            </div>`,
            en: `
            <div class="tl-wrap">
              <div class="tl-item active">
                <div class="tl-year">2024 閳?2027</div>
                <div class="tl-title">Yeditepe University</div>
                <div class="tl-desc">Internet and Network Technologies</div>
              </div>
              <div class="tl-item">
                <div class="tl-year">2020 閳?2024</div>
                <div class="tl-title">G鐪夎幗 Karde鑹er Anatolian High School</div>
                <div class="tl-desc">High School Education</div>
              </div>
            </div>
            <hr class="divider">
            <div class="tl-section-title">Certifications</div>
            <div class="tl-cert">
              <a href="https://learn.microsoft.com/en-us/users/bilalanl-8550/credentials/38e863aaef982a2d?ref=https%3A%2F%2Fwww.linkedin.com%2F" target="_blank" rel="noopener">Microsoft Certified: Fabric Data Engineer Associate (2026)</a>
              <a href="https://www.credly.com/badges/3852359e-8131-4422-9279-918a4f5c4c74" target="_blank" rel="noopener">Cisco AI Technical Practitioner (2026)</a>
            </div>`,
            de: `
            <div class="tl-wrap">
              <div class="tl-item active">
                <div class="tl-year">2024 閳?2027</div>
                <div class="tl-title">Yeditepe Universit鐩瞭</div>
                <div class="tl-desc">Internet- und Netzwerktechnologien</div>
              </div>
              <div class="tl-item">
                <div class="tl-year">2020 閳?2024</div>
                <div class="tl-title">G鐪夎幗 Karde鑹er Anatolisches Gymnasium</div>
                <div class="tl-desc">Gymnasiale Ausbildung</div>
              </div>
            </div>
            <hr class="divider">
            <div class="tl-section-title">Zertifikate</div>
            <div class="tl-cert">
              <a href="https://learn.microsoft.com/en-us/users/bilalanl-8550/credentials/38e863aaef982a2d?ref=https%3A%2F%2Fwww.linkedin.com%2F" target="_blank" rel="noopener">Microsoft Certified: Fabric Data Engineer Associate (2026)</a>
              <a href="https://www.credly.com/badges/3852359e-8131-4422-9279-918a4f5c4c74" target="_blank" rel="noopener">Cisco AI Technical Practitioner (2026)</a>
            </div>`
          }
        },
        {
          id: 'exp',
          label: { tr: ['Deneyim'], en: ['Experience'], de: ['Erfahrung'] },
          title: { tr: 'DENEY闄孧', en: 'EXPERIENCE', de: 'ERFAHRUNG' },
          html: {
            tr: `
            <p>Hen鐪墇 鏋氳噿renciyim. Deneyim kazand璋媖鑾絘 bu b鏋歭鐪塵鐪?g鐪塶celleyece鑷抜m.</p>`,
            en: `
            <p>I'm still a student. I'll update this section as I gain experience.</p>`,
            de: `
            <p>Ich bin noch Student. Ich werde diesen Bereich aktualisieren, sobald ich Erfahrung gesammelt habe.</p>`
          }
        },
        {
          id: 'bio',
          label: { tr: ['Hakk璋媘da'], en: ['About Me'], de: ['鑴篵er mich'] },
          title: { tr: 'HAKKIMDA', en: 'ABOUT ME', de: '鑴築ER MICH' },
          html: {
            tr: `
            <p>Merhaba! Ben <strong>閸涖劌銇夐悥?/strong>. Nam璋媎i鑷抏r <strong>ZTS</strong></p>
            <hr class="divider">
            <p>Siber G鐪塿enlik ve Yapay Zeka alanlar璋媙a ilgi duyuyorum ve bu alanlarda her g鐪塶 kendimi geli鑹irmek i鑾絠n 鑾絘bal璋媦orum. 鑴皕ellikle Yapay Zeka destekli Siber G鐪塿enlik Sistemleri 鐪墇erine yo鑷抲nla鑹rak, dijital d鐪塶yadaki tehditleri hen鐪墇 ger鑾絜kle鑹eden tespit edebilen ak璋媗l璋?botlar geli鑹irmeyi hedefliyorum.</p>
            <hr class="divider">
            <p style="color:rgba(0,245,255,0.38);font-size:12px;font-style:italic">
              Bunlar璋媙 d璋嬭墽璋媙da hobi olarak E-Spor, Basketbol, At璋媍璋媗璋媖 sporlar璋媙a ilgi duyuyorum. Gezmeyi ve yeni yerler ke鑹etmeyi seviyorum. Genellikle sessiz bir ki鑹li鑷抜m var ama aram璋媧daki buzlar璋?k璋媟d璋嬭噿璋媘璋媧da bazen de 鑾給k konu鑹bilirim :)
            </p>`,
            en: `
            <p>Hello! I'm <strong>閸涖劌銇夐悥?/strong>. Also known as <strong>ZTS</strong></p>
            <hr class="divider">
            <p>I'm passionate about Cybersecurity and Artificial Intelligence, and I strive to improve myself in these fields every day. I'm particularly focused on AI-powered Cybersecurity Systems, aiming to develop intelligent bots that can detect digital threats before they even occur.</p>
            <hr class="divider">
            <p style="color:rgba(0,245,255,0.38);font-size:12px;font-style:italic">
              Besides these, I'm interested in E-Sports, Basketball, and Shooting sports as hobbies. I love traveling and exploring new places. I'm generally a quiet person, but once we break the ice, I can be quite talkative sometimes :)
            </p>`,
            de: `
            <p>Hallo! Ich bin <strong>閸涖劌銇夐悥?/strong>. Auch bekannt als <strong>ZTS</strong></p>
            <hr class="divider">
            <p>Ich interessiere mich f鐪塺 Cybersicherheit und K鐪塶stliche Intelligenz und arbeite jeden Tag daran, mich in diesen Bereichen weiterzuentwickeln. Mein besonderer Fokus liegt auf KI-gest鐪塼zten Cybersicherheitssystemen, mit dem Ziel, intelligente Bots zu entwickeln, die digitale Bedrohungen erkennen, bevor sie auftreten.</p>
            <hr class="divider">
            <p style="color:rgba(0,245,255,0.38);font-size:12px;font-style:italic">
              Abgesehen davon interessiere ich mich f鐪塺 E-Sport, Basketball und Schie鑴絪port als Hobbys. Ich reise gerne und entdecke neue Orte. Ich bin generell eine ruhige Person, aber wenn das Eis gebrochen ist, kann ich manchmal auch sehr gespr鐩瞔hig sein :)
            </p>`
          }
        }
      ]
    },

    /* BIO: Pro Mode integration note. */
    {
      id: 'projects',
      label: { tr: ['PROJELER闄孧'], en: ['MY PROJECTS'], de: ['PROJEKTE'] },
      color: '#ff006e',
      subs: [
        {
          id: 'web',
          label: { tr: ['Siber G鐪塿enlik', 'Projeleri'], en: ['Cyber Security', 'Projects'], de: ['Cyber Security', 'Projekte'] },
          title: { tr: 'CYBER SECURITY PROJECTS', en: 'CYBER SECURITY PROJECTS', de: 'CYBER SECURITY PROJECTS' },
          html: {
            tr: `
            <p><strong>Projeler</strong></p>
            <ul>
              <li>鑴無k yak璋媙da...</li>
              <li>鑴無k yak璋媙da...</li>
              <li>鑴無k yak璋媙da...</li>
            </ul>
            <hr class="divider">
            <p><strong>Kulland璋嬭噿璋媘 Teknolojiler</strong></p>
            <ul>
              <li>Python</li>
              <li>[eklenecek]</li>
              <li>[eklenecek]</li>
            </ul>`,
            en: `
            <p><strong>Projects</strong></p>
            <ul>
              <li>Coming soon...</li>
              <li>Coming soon...</li>
              <li>Coming soon...</li>
            </ul>
            <hr class="divider">
            <p><strong>Technologies Used</strong></p>
            <ul>
              <li>Python</li>
              <li>[to be added]</li>
              <li>[to be added]</li>
            </ul>`,
            de: `
            <p><strong>Projekte</strong></p>
            <ul>
              <li>Kommt bald...</li>
              <li>Kommt bald...</li>
              <li>Kommt bald...</li>
            </ul>
            <hr class="divider">
            <p><strong>Verwendete Technologien</strong></p>
            <ul>
              <li>Python</li>
              <li>[wird hinzugef鐪塯t]</li>
              <li>[wird hinzugef鐪塯t]</li>
            </ul>`
          }
        },
        {
          id: 'mob',
          label: { tr: ['Yapay Zeka', 'Projeleri'], en: ['AI', 'Projects'], de: ['KI-', 'Projekte'] },
          title: { tr: 'AI PROJECTS', en: 'AI PROJECTS', de: 'AI PROJECTS' },
          html: {
            tr: `
            <p><strong>Projeler</strong></p>
            <ul>
              <li>鑴無k yak璋媙da...</li>
              <li>鑴無k yak璋媙da...</li>
            </ul>
            <hr class="divider">
            <p>Projeler hakk璋媙da bilgiler eklenecek</p>`,
            en: `
            <p><strong>Projects</strong></p>
            <ul>
              <li>Coming soon...</li>
              <li>Coming soon...</li>
            </ul>
            <hr class="divider">
            <p>Project details to be added</p>`,
            de: `
            <p><strong>Projekte</strong></p>
            <ul>
              <li>Kommt bald...</li>
              <li>Kommt bald...</li>
            </ul>
            <hr class="divider">
            <p>Projektdetails werden hinzugef鐪塯t</p>`
          }
        },
        {
          id: 'back',
          label: { tr: ['Karma', 'Projeler'], en: ['Mixed', 'Projects'], de: ['Gemischte', 'Projekte'] },
          title: { tr: 'KARMA PROJELER', en: 'MIXED PROJECTS', de: 'GEMISCHTE PROJEKTE' },
          html: {
            tr: `
            <p><strong>Projeler</strong></p>
            <ul>
              <li>鑴無k yak璋媙da...</li>
              <li>鑴無k yak璋媙da...</li>
            </ul>
            <hr class="divider">
            <p><strong>Kulland璋嬭噿璋媘 Teknolojiler</strong></p>
            <ul>
              <li>Python</li>
              <li>[eklenecek]</li>
              <li>[eklenecek]</li>
            </ul>`,
            en: `
            <p><strong>Projects</strong></p>
            <ul>
              <li>Coming soon...</li>
              <li>Coming soon...</li>
            </ul>
            <hr class="divider">
            <p><strong>Technologies Used</strong></p>
            <ul>
              <li>Python</li>
              <li>[to be added]</li>
              <li>[to be added]</li>
            </ul>`,
            de: `
            <p><strong>Projekte</strong></p>
            <ul>
              <li>Kommt bald...</li>
              <li>Kommt bald...</li>
            </ul>
            <hr class="divider">
            <p><strong>Verwendete Technologien</strong></p>
            <ul>
              <li>Python</li>
              <li>[wird hinzugef鐪塯t]</li>
              <li>[wird hinzugef鐪塯t]</li>
            </ul>`
          }
        }
      ]
    },

    /* BIO: Implementation note for this section. */
    {
      id: 'hobbies',
      label: { tr: ['HOB闄孡ER闄孧'], en: ['HOBBIES'], de: ['HOBBYS'] },
      color: '#00ff88',
      subs: [
        {
          id: 'esp',
          label: { tr: ['E-Spor'], en: ['E-Sports'], de: ['E-Sport'] },
          title: { tr: 'E-SPOR', en: 'E-SPORTS', de: 'E-SPORT' },
          html: {
            tr: `
            <p><strong>Favori Oyunlar</strong></p>
            <ul>
              <li>VALORANT</li>
              <li>CS2</li>
            </ul>
            <hr class="divider">
            <p>E-spor; bana ileti鑹m, tak璋媘 oyunu, stres alt璋媙da so鑷抲kkanl璋?karar verme ve h璋媧l璋?problem 鑾芥灇zme yetisi kazand璋媟d璋? Rekabet鑾絠 arenada edindi鑷抜m bu disiplin, sadece oyunlarda de鑷抜l, hayatta da bana yard璋媘c璋?oldu.</p>
            <hr class="divider">
            <p style="text-align:center"><a href="#" class="photo-link" data-gallery='[{"src":"assets/default/hobbies/espor.webp","cap":"闄宭k offline turnuvam, K鐪夎幗鐪塳鑾絜kmece Belediyesi E-Spor Merkezi, 2021"},{"src":"assets/default/hobbies/espor3.webp","cap":"K鐪夎幗鐪塳鑾絜kmece Espor Belediyesi Turnuvas璋媙da tak璋媘璋媘la birlikte. (En soldaki benim.)"}]' data-anim="astronaut">閳?FOTO鑷慠AFLARA BAK</a></p>`,
            en: `
            <p><strong>Favorite Games</strong></p>
            <ul>
              <li>VALORANT</li>
              <li>CS2</li>
            </ul>
            <hr class="divider">
            <p>E-sports taught me communication, teamwork, calm decision-making under pressure, and quick problem-solving. The discipline I gained in the competitive arena has helped me not only in games but also in life.</p>
            <hr class="divider">
            <p style="text-align:center"><a href="#" class="photo-link" data-gallery='[{"src":"assets/default/hobbies/espor.webp","cap":"My first offline tournament, K鐪夎幗鐪塳鑾絜kmece Municipality E-Sports Center, 2021"},{"src":"assets/default/hobbies/espor3.webp","cap":"With my team at the K鐪夎幗鐪塳鑾絜kmece Municipality E-Sports Tournament. (I am the one on the far left.)"}]' data-anim="astronaut">閳?VIEW PHOTOS</a></p>`,
            de: `
            <p><strong>Lieblingsspiele</strong></p>
            <ul>
              <li>VALORANT</li>
              <li>CS2</li>
            </ul>
            <hr class="divider">
            <p>E-Sport hat mir Kommunikation, Teamarbeit, besonnene Entscheidungsfindung unter Druck und schnelles Probleml鏋歴en beigebracht. Die Disziplin, die ich in der kompetitiven Arena gewonnen habe, hat mir nicht nur in Spielen, sondern auch im Leben geholfen.</p>
            <hr class="divider">
            <p style="text-align:center"><a href="#" class="photo-link" data-gallery='[{"src":"assets/default/hobbies/espor.webp","cap":"Mein erstes Offline-Turnier, K鐪夎幗鐪塳鑾絜kmece Gemeinde E-Sport-Zentrum, 2021"},{"src":"assets/default/hobbies/espor3.webp","cap":"Mit meinem Team beim K鐪夎幗鐪塳鑾絜kmece Gemeinde E-Sport-Turnier. (Ich bin ganz links.)"}]' data-anim="astronaut">閳?FOTOS ANSEHEN</a></p>`
          }
        },
        {
          id: 'sht',
          label: { tr: ['At璋媍璋媗璋媖'], en: ['Shooting'], de: ['Schie鑴絜n'] },
          title: { tr: 'ATICILIK', en: 'SHOOTING', de: 'SCHIE宀锋揩N' },
          html: {
            tr: `
            <p>At璋媍璋媗璋媖; sab璋媟, 鏋歾denetim ve stres y鏋歯etimi demektir. 10m haval璋?t鐪塮ek bran鑹ц皨nda edindi鑷抜m bu 'tek bir ana odaklanma' yetisi, bug鐪塶 karma鑹ц皨k problemleri 鑾芥灇zerken kulland璋嬭噿璋媘 en g鐪夎幗l鐪?zihinsel arac璋媘.</p>
            <hr class="divider">
            <p style="color:rgba(0,255,136,0.4);font-size:12px;font-style:italic">
              Konsantrasyon, sab璋媟 ve disiplin gerektiren bu sporu herkese tavsiye ederim. Bence bu sporu herkes en az bir kere de olsa deneyimlemeli. 鑴熺湁nk鐪?hem zevkli hem de bir o kadar zorlu bir spor.
            </p>
            <hr class="divider">
            <p style="text-align:center"><a href="#" class="photo-link" data-gallery='[{"src":"assets/default/hobbies/shooting.webp","cap":"Poligonda at璋嬭墽 talimi yaparken, 2024"},{"src":"assets/default/hobbies/shooting2.webp","cap":"At璋媍璋媗璋嬭噿璋媙 ilk ba鑹ar璋?.. , 2024"}]'>閳?FOTO鑷慠AFLARA BAK</a></p>`,
            en: `
            <p>Shooting means patience, self-control, and stress management. The ability to 'focus on a single moment' that I gained in the 10m air rifle discipline is the strongest mental tool I use today when solving complex problems.</p>
            <hr class="divider">
            <p style="color:rgba(0,255,136,0.4);font-size:12px;font-style:italic">
              I recommend this sport, which requires concentration, patience, and discipline, to everyone. I think everyone should experience it at least once. Because it's both enjoyable and equally challenging.
            </p>
            <hr class="divider">
            <p style="text-align:center"><a href="#" class="photo-link" data-gallery='[{"src":"assets/default/hobbies/shooting.webp","cap":"Shooting practice at the range, 2024"},{"src":"assets/default/hobbies/shooting2.webp","cap":"The early days of shooting... , 2024"}]'>閳?VIEW PHOTOS</a></p>`,
            de: `
            <p>Schie鑴絪port bedeutet Geduld, Selbstbeherrschung und Stressbew鐩瞝tigung. Die F鐩瞙igkeit, mich auf einen einzigen Moment zu konzentrieren, die ich in der 10m-Luftgewehr-Disziplin erworben habe, ist heute mein st鐩瞨kstes mentales Werkzeug beim L鏋歴en komplexer Probleme.</p>
            <hr class="divider">
            <p style="color:rgba(0,255,136,0.4);font-size:12px;font-style:italic">
              Ich empfehle diesen Sport, der Konzentration, Geduld und Disziplin erfordert, jedem. Ich denke, jeder sollte ihn mindestens einmal erleben. Denn er ist sowohl unterhaltsam als auch ebenso herausfordernd.
            </p>
            <hr class="divider">
            <p style="text-align:center"><a href="#" class="photo-link" data-gallery='[{"src":"assets/default/hobbies/shooting.webp","cap":"Schie鑴界湁bung am Schie鑴絪tand, 2024"},{"src":"assets/default/hobbies/shooting2.webp","cap":"Die Anf鐩瞡ge des Schie鑴絪ports... , 2024"}]'>閳?FOTOS ANSEHEN</a></p>`
          }
        },
        {
          id: 'tec',
          label: { tr: ['Teknoloji', 'Trendleri'], en: ['Tech', 'Trends'], de: ['Tech-', 'Trends'] },
          title: { tr: 'TECH TRENDS', en: 'TECH TRENDS', de: 'TECH TRENDS' },
          html: {
            tr: `
            <p><strong>Takip Etti鑷抜m Alanlar</strong></p>
            <ul>
              <li>Yapay Zeka &amp; LLM geli鑹eleri</li>
              <li>Siber g鐪塿enlik haberleri</li>
              <li>Yeni siber g鐪塿enlik &amp; yapay zeka uygulamalar璋?/li>
              <li>Donan璋媘 &amp; yonga mimarisi</li>
              <li>Kuantum Bilgisayar</li>
            </ul>
            <hr class="divider">
            <p>Teknoloji trendlerini takip etmeyi 鑾給k seviyorum. 鑴熺湁nk鐪?bu sayede yapay zeka, siber g鐪塿enlik ve di鑷抏r alanlarda kendimi geli鑹irebilecek fikirleri kafamda olu鑹urabiliyorum. Ayr璋媍a 鑾給k h璋媧l璋?ilerleyen teknolojileri ka鑾借皨rmayarak kendimi geli鑹iriyorum.</p>`,
            en: `
            <p><strong>Areas I Follow</strong></p>
            <ul>
              <li>Artificial Intelligence &amp; LLM developments</li>
              <li>Cybersecurity news</li>
              <li>New cybersecurity &amp; AI applications</li>
              <li>Hardware &amp; chip architecture</li>
              <li>Quantum Computing</li>
            </ul>
            <hr class="divider">
            <p>I love following technology trends. This way, I can form ideas in my mind to improve myself in artificial intelligence, cybersecurity, and other fields. I also keep up with rapidly advancing technologies to continuously develop myself.</p>`,
            de: `
            <p><strong>Bereiche, denen ich folge</strong></p>
            <ul>
              <li>K鐪塶stliche Intelligenz &amp; LLM-Entwicklungen</li>
              <li>Cybersicherheits-Nachrichten</li>
              <li>Neue Cybersicherheits- &amp; KI-Anwendungen</li>
              <li>Hardware &amp; Chiparchitektur</li>
              <li>Quantencomputer</li>
            </ul>
            <hr class="divider">
            <p>Ich verfolge sehr gerne Technologietrends. Dadurch kann ich Ideen entwickeln, um mich in den Bereichen K鐪塶stliche Intelligenz, Cybersicherheit und anderen Feldern weiterzuentwickeln. Au鑴絜rdem halte ich mich durch die schnell fortschreitenden Technologien stets auf dem Laufenden.</p>`
          }
        },
        {
          id: 'trv',
          label: { tr: ['Seyahat'], en: ['Travel'], de: ['Reisen'] },
          title: { tr: 'SEYAHAT', en: 'TRAVEL', de: 'REISEN' },
          html: {
            tr: `
            <p>Seyahat etmeyi ve yeni yerler ke鑹etmeyi seviyorum. 鑴熺湁nk鐪?her yeni yere gitti鑷抜mde yeni fikirler ve deneyimler kazan璋媦orum. Ayr璋媍a yeni yerlere gidince sanki beynimin farkl璋?yerlerini kullan璋媦ormu鑹?gibi hissediyorum.</p>`,
            en: `
            <p>I love traveling and exploring new places. Because every time I visit a new place, I gain new ideas and experiences. Also, when I go to new places, I feel like I'm using different parts of my brain.</p>`,
            de: `
            <p>Ich liebe es zu reisen und neue Orte zu entdecken. Denn jedes Mal, wenn ich einen neuen Ort besuche, gewinne ich neue Ideen und Erfahrungen. Au鑴絜rdem habe ich das Gef鐪塰l, verschiedene Teile meines Gehirns zu nutzen, wenn ich neue Orte besuche.</p>`
          }
        }
      ]
    },

    /* BIO: Implementation note for this section. */
    {
      id: 'skills',
      label: { tr: ['YETENEKLER闄孧', 've 闄孡G闄孡ER闄孧'], en: ['SKILLS &', 'INTERESTS'], de: ['F鑴汬IGKEITEN', '& INTERESSEN'] },
      color: '#bf00ff',
      subs: [
        {
          id: 'ai',
          label: { tr: ['Yapay Zeka'], en: ['娴滃搫浼愰弲楦垮厴'], de: ['K鐪塶stliche', 'Intelligenz'] },
          title: { tr: 'YAPAY ZEKA', en: '娴滃搫浼愰弲楦垮厴', de: 'K鑴篘STLICHE INTELLIGENZ' },
          html: {
            tr: `
            <p><strong>K鐪塼鐪塸haneler &amp; Ara鑾絣ar</strong></p>
            <ul>
              <li>Obsidian</li>
              <li>Codex, VS Code, Gemini, Claude Code</li>
            </ul>
            <hr class="divider">
            <p><strong>Tamamlad璋嬭噿璋媘 Projeler</strong></p>
            <ul>
              <li>
                <a href="https://github.com/bilalgurkansanli/Health_Insurance_Cost_Prediction" target="_blank" rel="noopener">Health Insurance Cost Prediction</a><br>
                <span>
                  ML modelleriyle ki鑹sel 鏋歾elliklere dayal璋?sa鑷抣璋媖 sigortas璋?maliyeti tahmini <strong>(Denetimli 鑴拌噿renme)</strong>
                </span>
              </li>
            </ul>
            <hr class="divider">
            <p><strong>闄宭gi Alanlar璋?/strong></p>
            <ul>
              <li>Do鑷抋l Dil 闄岃墽leme (NLP)</li>
              <li>Makine 鑴拌噿renmesi</li>
              <li>鑴簉etken Yapay Zeka (GenAI)</li>
            </ul>`,
            en: `
            <p><strong>閻儴鐦戞惔鎾虫嫲瀹搞儱鍙?/strong></p>
            <ul>
              <li>Obsidian</li>
              <li>Codex, VS Code, Gemini, Claude Code</li>
            </ul>
            <hr class="divider">
            <p><strong>Completed Projects</strong></p>
            <ul>
              <li>
                <a href="https://github.com/bilalgurkansanli/Health_Insurance_Cost_Prediction" target="_blank" rel="noopener">Health Insurance Cost Prediction</a><br>
                <span>
                  Health insurance cost prediction based on personal features using ML models <strong>(Supervised Learning)</strong>
                </span>
              </li>
            </ul>
            <hr class="divider">
            <p><strong>Areas of Interest</strong></p>
            <ul>
              <li>Natural Language Processing (NLP)</li>
              <li>Machine Learning</li>
              <li>Generative AI (GenAI)</li>
            </ul>`,
            de: `
            <p><strong>Bibliotheken &amp; Werkzeuge</strong></p>
            <ul>
              <li>Obsidian</li>
              <li>Codex, VS Code, Gemini, Claude Code</li>
            </ul>
            <hr class="divider">
            <p><strong>Abgeschlossene Projekte</strong></p>
            <ul>
              <li>
                <a href="https://github.com/bilalgurkansanli/Health_Insurance_Cost_Prediction" target="_blank" rel="noopener">Health Insurance Cost Prediction</a><br>
                <span>
                  Krankenversicherungskostenvorhersage basierend auf pers鏋歯lichen Merkmalen mit ML-Modellen <strong>(鑴篵erwachtes Lernen)</strong>
                </span>
              </li>
            </ul>
            <hr class="divider">
            <p><strong>Interessengebiete</strong></p>
            <ul>
              <li>Nat鐪塺liche Sprachverarbeitung (NLP)</li>
              <li>Maschinelles Lernen</li>
              <li>Generative KI (GenAI)</li>
            </ul>`
          }
        },
        {
          id: 'sec',
          label: { tr: ['Siber', 'Guvenlik'], en: ['\\u65b0\\u80fd\\u6e90', '\\u6c7d\\u8f66'], de: ['Cyber-', 'Sicherheit'] },
          title: { tr: 'SIBER GUVENLIK', en: '\\u65b0\\u80fd\\u6e90\\u6c7d\\u8f66', de: 'CYBERSICHERHEIT' },
          html: {
            tr: `
            <p><strong>闄宭gi Alanlar璋?/strong></p>
            <ul>
              <li>A鑷?g鐪塿enli鑷抜</li>
              <li>Penetrasyon testi</li>
              <li>G鐪塿enlik a鑾借皨鑷掕皨 analizi (CVE)</li>
              <li>Kriptografi</li>
            </ul>
            <hr class="divider">
            <p><strong>Kulland璋嬭噿璋媘 Ara鑾絣ar</strong></p>
            <ul>
              <li>Nmap / Zenmap</li>
              <li>Metasploit</li>
              <li>Burp Suite</li>
              <li>[Di鑷抏r ara鑾絣ar eklenecek]</li>
            </ul>
            <hr class="divider">
            <p>鑹 an Cisco'nun CyberOps ve Ethical Hacking e鑷抜timlerini al璋媦orum. Bu e鑷抜timler sonras璋媙daysa sertifika s璋媙avlar璋媙a girip sertifikalar璋媘璋?alaca鑷掕皨m.</p>`,
            en: `
            <p><strong>閻梻鈹掗崗纾嬪彯妫板棗鐓?/strong></p>
            <ul>
              <li>閺傛媽鍏樺┃鎰嫰鏉?/li>
              <li>閺呴缚鍏樻惔褑鍩?/li>
              <li>閻㈠灚鐫滄稉搴ｆ暩妞硅京閮寸紒?/li>
              <li>閼奉亜濮╂す楣冣敀娑撳氦婧呴懕鏃傜秹</li>
            </ul>`,
            de: `
            <p><strong>Interessengebiete</strong></p>
            <ul>
              <li>Netzwerksicherheit</li>
              <li>Penetrationstests</li>
              <li>Schwachstellenanalyse (CVE)</li>
              <li>Kryptographie</li>
            </ul>
            <hr class="divider">
            <p><strong>Verwendete Werkzeuge</strong></p>
            <ul>
              <li>Nmap / Zenmap</li>
              <li>Metasploit</li>
              <li>Burp Suite</li>
              <li>[Weitere Werkzeuge werden hinzugef鐪塯t]</li>
            </ul>
            <hr class="divider">
            <p>Ich absolviere derzeit Ciscos CyberOps- und Ethical-Hacking-Kurse. Danach werde ich die Zertifizierungspr鐪塮ungen ablegen, um meine Zertifikate zu erhalten.</p>`
          }
        }
      ]
    },

    /* BIO: Implementation note for this section. */
    {
      id: 'contact',
      label: { tr: ['闄孡ET闄岃墻闄孧'], en: ['CONTACT'], de: ['KONTAKT'] },
      color: '#ffee00',
      subs: [
        {
          id: 'mail',
          label: { tr: ['E-posta'], en: ['E-mail'], de: ['E-Mail'] },
          title: { tr: 'E-POSTA', en: 'EMAIL', de: 'E-MAIL' },
          html: {
            tr: `
            <p>Bana e-posta ile ula鑹bilirsiniz:</p>
            <hr class="divider">
            <p>
              <a href="mailto:dahat5632@gmail.com"
                 style="color:#ffee00;text-shadow:0 0 12px #ffee00;font-size:14px;border-bottom:1px solid rgba(255,238,0,0.4)">
                dahat5632@gmail.com
              </a>
            </p>
            <hr class="divider">
            <p style="color:rgba(255,238,0,0.45);font-size:12px">
              闄岃墽 birli鑷抜 teklifleri, proje fikirleri veya sadece merhaba demek i鑾絠n yazmaktan 鑾絜kinmeyin.
            </p>`,
            en: `
            <p>You can reach me via email:</p>
            <hr class="divider">
            <p>
              <a href="mailto:dahat5632@gmail.com"
                 style="color:#ffee00;text-shadow:0 0 12px #ffee00;font-size:14px;border-bottom:1px solid rgba(255,238,0,0.4)">
                dahat5632@gmail.com
              </a>
            </p>
            <hr class="divider">
            <p style="color:rgba(255,238,0,0.45);font-size:12px">
              Don't hesitate to write for collaboration offers, project ideas, or just to say hello.
            </p>`,
            de: `
            <p>Sie k鏋歯nen mich per E-Mail erreichen:</p>
            <hr class="divider">
            <p>
              <a href="mailto:dahat5632@gmail.com"
                 style="color:#ffee00;text-shadow:0 0 12px #ffee00;font-size:14px;border-bottom:1px solid rgba(255,238,0,0.4)">
                dahat5632@gmail.com
              </a>
            </p>
            <hr class="divider">
            <p style="color:rgba(255,238,0,0.45);font-size:12px">
              Z鏋歡ern Sie nicht, mir f鐪塺 Kooperationsangebote, Projektideen oder einfach nur um Hallo zu sagen zu schreiben.
            </p>`
          }
        },
        {
          id: 'soc',
          label: { tr: ['Sosyal Medya'], en: ['Social Media'], de: ['Soziale Medien'] },
          title: { tr: 'SOSYAL MEDYA', en: 'SOCIAL MEDIA', de: 'SOZIALE MEDIEN' },
          html: {
            tr: `
            <p>Beni sosyal medyada bulun. LinkedIn'de ba鑷抣ant璋?atmaktan 鑾絜kinmeyin.</p>
            <hr class="divider">
            <p><strong style="color:#ffee00">LinkedIn</strong></p>
            <a href="https://www.linkedin.com/in/bilalgurkansanli/" target="_blank" rel="noopener"
               style="color:#ffee00;text-decoration:none;display:flex;align-items:center;gap:10px;
                      margin-top:8px;padding:12px;border:1px solid rgba(255,238,0,0.25);
                      transition:all .2s;margin-bottom:16px"
               onmouseover="this.style.background='rgba(255,238,0,0.06)';this.style.borderColor='rgba(255,238,0,0.6)'"
               onmouseout="this.style.background='';this.style.borderColor='rgba(255,238,0,0.25)'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffee00" style="flex-shrink:0">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span style="font-size:12px">linkedin.com/in/bilalgurkansanli</span>
            </a>
            <p><strong style="color:#ffee00">GitHub</strong></p>
            <a href="https://github.com/bilalgurkansanli" target="_blank" rel="noopener"
               style="color:#ffee00;text-decoration:none;display:flex;align-items:center;gap:10px;
                      margin-top:8px;padding:12px;border:1px solid rgba(255,238,0,0.25);
                      transition:all .2s"
               onmouseover="this.style.background='rgba(255,238,0,0.06)';this.style.borderColor='rgba(255,238,0,0.6)'"
               onmouseout="this.style.background='';this.style.borderColor='rgba(255,238,0,0.25)'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffee00" style="flex-shrink:0">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span style="font-size:12px">github.com/bilalgurkansanli</span>
            </a>`,
            en: `
            <p>Find me on social media. Don't hesitate to connect on LinkedIn.</p>
            <hr class="divider">
            <p><strong style="color:#ffee00">LinkedIn</strong></p>
            <a href="https://www.linkedin.com/in/bilalgurkansanli/" target="_blank" rel="noopener"
               style="color:#ffee00;text-decoration:none;display:flex;align-items:center;gap:10px;
                      margin-top:8px;padding:12px;border:1px solid rgba(255,238,0,0.25);
                      transition:all .2s;margin-bottom:16px"
               onmouseover="this.style.background='rgba(255,238,0,0.06)';this.style.borderColor='rgba(255,238,0,0.6)'"
               onmouseout="this.style.background='';this.style.borderColor='rgba(255,238,0,0.25)'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffee00" style="flex-shrink:0">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span style="font-size:12px">linkedin.com/in/bilalgurkansanli</span>
            </a>
            <p><strong style="color:#ffee00">GitHub</strong></p>
            <a href="https://github.com/bilalgurkansanli" target="_blank" rel="noopener"
               style="color:#ffee00;text-decoration:none;display:flex;align-items:center;gap:10px;
                      margin-top:8px;padding:12px;border:1px solid rgba(255,238,0,0.25);
                      transition:all .2s"
               onmouseover="this.style.background='rgba(255,238,0,0.06)';this.style.borderColor='rgba(255,238,0,0.6)'"
               onmouseout="this.style.background='';this.style.borderColor='rgba(255,238,0,0.25)'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffee00" style="flex-shrink:0">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span style="font-size:12px">github.com/bilalgurkansanli</span>
            </a>`,
            de: `
            <p>Finden Sie mich in sozialen Medien. Z鏋歡ern Sie nicht, sich auf LinkedIn zu vernetzen.</p>
            <hr class="divider">
            <p><strong style="color:#ffee00">LinkedIn</strong></p>
            <a href="https://www.linkedin.com/in/bilalgurkansanli/" target="_blank" rel="noopener"
               style="color:#ffee00;text-decoration:none;display:flex;align-items:center;gap:10px;
                      margin-top:8px;padding:12px;border:1px solid rgba(255,238,0,0.25);
                      transition:all .2s;margin-bottom:16px"
               onmouseover="this.style.background='rgba(255,238,0,0.06)';this.style.borderColor='rgba(255,238,0,0.6)'"
               onmouseout="this.style.background='';this.style.borderColor='rgba(255,238,0,0.25)'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffee00" style="flex-shrink:0">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span style="font-size:12px">linkedin.com/in/bilalgurkansanli</span>
            </a>
            <p><strong style="color:#ffee00">GitHub</strong></p>
            <a href="https://github.com/bilalgurkansanli" target="_blank" rel="noopener"
               style="color:#ffee00;text-decoration:none;display:flex;align-items:center;gap:10px;
                      margin-top:8px;padding:12px;border:1px solid rgba(255,238,0,0.25);
                      transition:all .2s"
               onmouseover="this.style.background='rgba(255,238,0,0.06)';this.style.borderColor='rgba(255,238,0,0.6)'"
               onmouseout="this.style.background='';this.style.borderColor='rgba(255,238,0,0.25)'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffee00" style="flex-shrink:0">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span style="font-size:12px">github.com/bilalgurkansanli</span>
            </a>`
          }
        }
      ]
    }
  ]
};

/* BIO: Implementation note for this section. */
let currentLang  = 'de';
let currentTheme = 'dark';

const UI = {
  tr: {
    tree: 'ANA AGAC',
    back: '閳?GER闄?D鑴癗',
    boot: 'S闄孲TEM BA鑹ATILIYOR',
    skip: 'SKIP',
    modeDefault: 'VARSAYILAN MOD',
    modePro: 'PRO MOD',
    defaultLandscapeHint: 'Default Mode dikey olarak 鏋歯erilir.',
    splashDesktopPro: 'PRO MODE 闄孡E BA鑹A',
    splashTagline: 'AI Trainer',
    splashGpuWarnLabel: 'DONANIM',
    splashGpuWarnTitle: 'Pro Mode bu cihazda kasabilir',
    splashGpuWarnBody:
      'GPU / grafik 鏋歾ellikleriniz tam 3D kokpit i鑾絠n yetersiz g鏋歳鐪塶ebilir. Varsay璋媗an mod daha ak璋媍璋媎璋媟 ve giri鑹e intro1 videosunu g鏋歴terir. Varsay璋媗an mod i鑾絠n ilk d鐪夎噿meye, Pro Mode\'u denemek i鑾絠n ikinciye dokunun.',
    splashGpuDefaultBtn: 'DEFAULT MODE',
    splashGpuProBtn: 'Y闄孨E DE PRO MODE',
    intro2SkipAria: 'Ge鑾絠鑹?videosunu atla',
    locale: 'tr-TR',
    skipToOverview: '鑴皕et i鑾絜ri鑷抏 atla',
    overviewTitle: '閸涖劌銇夐悥?閳?Portfolyo (varsay璋媗an g鏋歳鐪塶鐪塵)',
    overviewLead:
      'Etkile鑹mli d鐪夎噿鐪塵 a鑷抋c璋媙da gezinmek i鑾絠n d鐪夎噿鐪塵leri Tab ile se鑾絠p Enter veya Space ile a鑾借皨n; i鑾絜rik hologram panelinde g鏋歴terilir ve metin se鑾絠lebilir. 鑴簊t ara鑾?鑾絬bu鑷抲ndan dil, d璋嬭墽 ba鑷抣ant璋媗ar ve Pro Mode kullan璋媗abilir.',
    overviewNavAria: 'H璋媧l璋?ba鑷抣ant璋媗ar',
    overviewProLink: '鑴鸿幗 boyutlu Pro Mode kokpit deneyimi',
    overviewTreeHeading: 'Portfolyo a鑷抋c璋?ve arka plan',
    overviewTreeNote:
      'Tam ekran SVG d鐪夎噿鐪塵 grafi鑷抜 ana gezinmedir. Arkadaki izgara, par鑾絘c璋媖 ve imle鑾?izi tuval katmanlar璋?yaln璋媧ca g鏋歳sel efekt i鑾絠ndir.',
    toolbarAria: 'Site ara鑾?鑾絬bu鑷抲',
    svgTreeAria:
      'Etkile鑹mli portfolyo a鑷抋c璋?閳?d鐪夎噿鐪塵leri Tab ve Enter veya Space ile veya fare ile a鑾借皨n',
    masterVolAria: 'Ana ses seviyesi',
    seekAria: '鑴焌lma konumu',
    backAria: 'Geri d鏋歯',
    holoCloseAria: 'Paneli kapat',
    linkedinAria: 'LinkedIn profili (yeni sekmede a鑾借皨l璋媟)',
    githubAria: 'GitHub profili (yeni sekmede a鑾借皨l璋媟)',
    trailToggleAria: '闄宮le鑾?izi efekti',
    gridToggleAria: 'Izgara efekti',
    fsEnterAria: 'Tam ekran',
    fsExitAria: 'Tam ekrandan 鑾借皨k',
    intro1SkipAria: 'A鑾借皨l璋嬭墽 videosunu atla',
    mpPrevAria: '鑴皀ceki par鑾絘',
    mpPlayAria: '鑴焌l veya duraklat',
    mpNextAria: 'Sonraki par鑾絘',
    regionHudAria: 'Status bar',
    regionMediaAria: 'Ses ve k鐪夎幗鐪塳 m鐪墇ik 鑾絘lar',
    regionSplashVolAria: 'Kar鑹ц皨lama ekran璋?閳?ses ve test',
    regionSplashHeroAria: 'Kar鑹ц皨lama ekran璋?閳?ba鑹璋媖',
    regionSplashStartAria: 'Kar鑹ц皨lama ekran璋?閳?ba鑹atma',
    orpetronSotdTip: 'Orpetron Award',
    orpetronSotdAria: 'Orpetron 鏋歞鐪塴 sayfas璋媙a git 閳?yeni sekmede a鑾借皨l璋媟',
    designNomineesSotdTip: 'Design Nominees Award',
    designNomineesSotdAria: 'Design Nominees 鏋歞鐪塴 sayfas璋媙a git 閳?yeni sekmede a鑾借皨l璋媟',
    awwwardsNomineeTip: 'Awwwards Nominee',
    awwwardsNomineeAria: 'Awwwards nominee sayfas璋媙a git 閳?yeni sekmede a鑾借皨l璋媟'
  },
  en: {
    tree: 'MAIN TREE',
    back: '閳?GO BACK',
    boot: 'SYSTEM STARTING',
    skip: 'SKIP',
    modeDefault: 'DEFAULT MODE',
    modePro: 'PRO MODE',
    defaultLandscapeHint: 'Default Mode is recommended in portrait.',
    splashDesktopPro: 'START WITH PRO MODE',
    splashTagline: 'AI Trainer',
    splashGpuWarnLabel: 'HARDWARE',
    splashGpuWarnTitle: 'Pro Mode may run poorly on this device',
    splashGpuWarnBody:
      'Your GPU / graphics tier looks limited or could not be read (common on phones). Default Mode is smoother and starts with the intro (intro1) video 閳?first button. Tap the second button to try Pro anyway.',
    splashGpuDefaultBtn: 'SWITCH TO DEFAULT MODE',
    splashGpuProBtn: 'TRY PRO MODE ANYWAY',
    intro2SkipAria: 'Skip transition video',
    locale: 'en-GB',
    skipToOverview: 'Skip to summary content',
    overviewTitle: '閸涖劌銇夐悥?閳?Portfolio (default view)',
    overviewLead:
      'Navigate the interactive node tree: Tab to a node, then press Enter or Space to open it; content appears in the hologram panel with selectable text. Use the top toolbar for language, external links, and Pro Mode.',
    overviewNavAria: 'Quick links',
    overviewProLink: 'Three-dimensional Pro Mode cockpit experience',
    overviewTreeHeading: 'Portfolio tree and background',
    overviewTreeNote:
      'The full-screen SVG node graph is the main navigation. The grid, particle, and cursor-trail canvases are decorative only.',
    toolbarAria: 'Site toolbar',
    svgTreeAria:
      'Interactive portfolio tree 閳?open nodes with Tab and Enter or Space, or with the pointer',
    masterVolAria: 'Master volume',
    seekAria: 'Playback position',
    backAria: 'Go back',
    holoCloseAria: 'Close panel',
    linkedinAria: 'LinkedIn profile (opens in a new tab)',
    githubAria: 'GitHub profile (opens in a new tab)',
    trailToggleAria: 'Cursor trail effect',
    gridToggleAria: 'Grid effect',
    fsEnterAria: 'Enter fullscreen',
    fsExitAria: 'Exit fullscreen',
    intro1SkipAria: 'Skip intro video',
    mpPrevAria: 'Previous track',
    mpPlayAria: 'Play or pause',
    mpNextAria: 'Next track',
    regionHudAria: 'Status bar',
    regionMediaAria: 'Volume and mini music player',
    regionSplashVolAria: 'Welcome screen 閳?volume and test',
    regionSplashHeroAria: 'Welcome screen 閳?headline',
    regionSplashStartAria: 'Welcome screen 閳?start',
    orpetronSotdTip: 'Orpetron Award',
    orpetronSotdAria: 'Open Orpetron award feature 閳?opens in a new tab',
    designNomineesSotdTip: 'Design Nominees Award',
    designNomineesSotdAria: 'Open Design Nominees award feature 閳?opens in a new tab',
    awwwardsNomineeTip: 'Awwwards Nominee',
    awwwardsNomineeAria: 'Open Awwwards nominee feature 閳?opens in a new tab'
  },
  de: {
    tree: 'HAUPTBAUM',
    back: '閳?ZUR鑴篊K',
    boot: 'SYSTEM STARTET',
    skip: 'SKIP',
    modeDefault: 'STANDARD-MODUS',
    modePro: 'PRO-MODUS',
    defaultLandscapeHint: 'Standard閳ユ厷odus: Hochformat wird empfohlen.',
    splashDesktopPro: 'MIT PRO-MODUS STARTEN',
    splashTagline: 'AI Trainer',
    splashGpuWarnLabel: 'HARDWARE',
    splashGpuWarnTitle: 'Der Pro-Modus kann auf diesem Ger鐩瞭 ruckeln',
    splashGpuWarnBody:
      'Ihre GPU wirkt eingeschr鐩瞡kt oder konnte nicht ermittelt werden (h鐩瞮fig auf Mobilger鐩瞭en). Der Standard閳ユ厷odus ist fl鐪塻siger und startet mit dem Intro閳ユ叆ideo (intro1) 閳?erster Knopf. F鐪塺 Pro trotzdem den zweiten Knopf w鐩瞙len.',
    splashGpuDefaultBtn: 'ZUM STANDARD-MODUS',
    splashGpuProBtn: 'PRO-MODUS TROTZDEM',
    intro2SkipAria: '鑴篵ergangsvideo 鐪塨erspringen',
    locale: 'de-DE',
    skipToOverview: 'Zur Zusammenfassung springen',
    overviewTitle: '閸涖劌銇夐悥?閳?Portfolio (Standardansicht)',
    overviewLead:
      'Im interaktiven Knotenbaum navigieren: Mit Tab fokussieren, mit Enter oder Leertaste 鏋歠fnen; Inhalte erscheinen im Hologramm閳ユ厼anel mit markierbarem Text. Oben: Sprache, externe Links und Pro閳ユ厷odus.',
    overviewNavAria: 'Schnellzugriff',
    overviewProLink: 'Dreidimensionales Pro閳ユ厷odus閳ユ厤ockpit',
    overviewTreeHeading: 'Portfolio閳ユ厠aum und Hintergrund',
    overviewTreeNote:
      'Der SVG閳ユ厴notengraph im Vollbild ist die Hauptnavigation. Raster-, Partikel- und Cursor閳ユ叀pur閳ユ厫benen sind rein dekorativ.',
    toolbarAria: 'Seitenleiste',
    svgTreeAria:
      'Interaktiver Portfolio閳ユ厠aum 閳?Knoten mit Tab und Enter oder Leertaste oder mit der Maus 鏋歠fnen',
    masterVolAria: 'Gesamtlautst鐩瞨ke',
    seekAria: 'Wiedergabeposition',
    backAria: 'Zur鐪塩k',
    holoCloseAria: 'Panel schlie鑴絜n',
    linkedinAria: 'LinkedIn閳ユ厼rofil (鏋歠fnet in neuem Tab)',
    githubAria: 'GitHub閳ユ厼rofil (鏋歠fnet in neuem Tab)',
    trailToggleAria: 'Cursor閳ユ叀pur閳ユ厫ffekt',
    gridToggleAria: 'Raster閳ユ厫ffekt',
    fsEnterAria: 'Vollbild',
    fsExitAria: 'Vollbild beenden',
    intro1SkipAria: 'Intro閳ユ叆ideo 鐪塨erspringen',
    mpPrevAria: 'Vorheriger Titel',
    mpPlayAria: 'Wiedergabe oder Pause',
    mpNextAria: 'N鐩瞔hster Titel',
    regionHudAria: 'Status bar',
    regionMediaAria: 'Lautst鐩瞨ke und Mini閳ユ厷usikplayer',
    regionSplashVolAria: 'Begr鐪夎劷ung 閳?Lautst鐩瞨ke und Test',
    regionSplashHeroAria: 'Begr鐪夎劷ung 閳?鑴篵erschrift',
    regionSplashStartAria: 'Begr鐪夎劷ung 閳?Start',
    orpetronSotdTip: 'Orpetron Award',
    orpetronSotdAria: 'Orpetron閳ユ厜uszeichnungsseite 閳?鏋歠fnet in neuem Tab',
    designNomineesSotdTip: 'Design Nominees Award',
    designNomineesSotdAria: 'Design-Nominees閳ユ厜uszeichnungsseite 閳?鏋歠fnet in neuem Tab',
    awwwardsNomineeTip: 'Awwwards Nominee',
    awwwardsNomineeAria: 'Awwwards閳ユ厸ominee閳ユ叀eite 閳?鏋歠fnet in neuem Tab'
  }
};



/* BIO: Repurpose the former German language slot as Chinese for this GitHub Pages copy. */
function applyChineseLanguageSlotDefault() {
  DATA.label.de = ['\u5468\u5929\u723d'];
  UI.de = {
    tree: '\u4e3b\u6811',
    back: '\u8fd4\u56de',
    boot: '\u7cfb\u7edf\u542f\u52a8\u4e2d',
    skip: '\u8df3\u8fc7',
    modeDefault: '\u9ed8\u8ba4\u6a21\u5f0f',
    modePro: '\u4e13\u4e1a\u6a21\u5f0f',
    defaultLandscapeHint: '\u9ed8\u8ba4\u6a21\u5f0f\u5efa\u8bae\u7ad6\u5c4f\u6d4f\u89c8\u3002',
    splashDesktopPro: '\u4ece\u4e13\u4e1a\u6a21\u5f0f\u5f00\u59cb',
    splashTagline: '\u4f18\u79c0\u7684AI\u8bad\u7ec3\u5e08',
    splashGpuWarnLabel: '\u786c\u4ef6',
    splashGpuWarnTitle: '\u4e13\u4e1a\u6a21\u5f0f\u53ef\u80fd\u8fd0\u884c\u8f83\u6162',
    splashGpuWarnBody: '\u4f60\u7684\u8bbe\u5907\u56fe\u5f62\u6027\u80fd\u53ef\u80fd\u4e0d\u8db3\u4ee5\u6d41\u7545\u8fd0\u884c 3D \u9a7e\u9a76\u8231\u3002',
    splashGpuDefaultBtn: '\u5207\u6362\u5230\u9ed8\u8ba4\u6a21\u5f0f',
    splashGpuProBtn: '\u4ecd\u7136\u5c1d\u8bd5\u4e13\u4e1a\u6a21\u5f0f',
    intro2SkipAria: '\u8df3\u8fc7\u8fc7\u6e21\u89c6\u9891',
    locale: 'zh-CN',
    skipToOverview: '\u8df3\u5230\u6458\u8981\u5185\u5bb9',
    overviewTitle: '\u5468\u5929\u723d - Portfolio',
    overviewLead: '\u901a\u8fc7\u4ea4\u4e92\u5f0f\u8282\u70b9\u6811\u6d4f\u89c8\u5185\u5bb9\u3002',
    overviewNavAria: '\u5feb\u901f\u94fe\u63a5',
    overviewProLink: '\u4e09\u7ef4\u4e13\u4e1a\u6a21\u5f0f\u9a7e\u9a76\u8231\u4f53\u9a8c',
    overviewTreeHeading: '\u4f5c\u54c1\u96c6\u6811\u4e0e\u80cc\u666f',
    overviewTreeNote: '\u5168\u5c4f\u8282\u70b9\u56fe\u662f\u4e3b\u8981\u5bfc\u822a\u3002',
    toolbarAria: '\u7ad9\u70b9\u5de5\u5177\u680f',
    svgTreeAria: '\u4ea4\u4e92\u5f0f\u4f5c\u54c1\u96c6\u6811',
    masterVolAria: '\u4e3b\u97f3\u91cf',
    seekAria: '播放位置',
    backAria: '\u8fd4\u56de',
    holoCloseAria: '\u5173\u95ed\u9762\u677f',
    linkedinAria: 'LinkedIn',
    githubAria: 'GitHub',
    trailToggleAria: '\u5149\u6807\u8f68\u8ff9\u6548\u679c',
    gridToggleAria: '\u7f51\u683c\u6548\u679c',
    fsEnterAria: '\u8fdb\u5165\u5168\u5c4f',
    fsExitAria: '\u9000\u51fa\u5168\u5c4f',
    intro1SkipAria: '\u8df3\u8fc7\u5f00\u573a\u89c6\u9891',
    mpPrevAria: '\u4e0a\u4e00\u9996',
    mpPlayAria: '\u64ad\u653e\u6216\u6682\u505c',
    mpNextAria: '\u4e0b\u4e00\u9996',
    regionHudAria: 'Status bar',
    regionMediaAria: '\u97f3\u91cf\u4e0e\u8ff7\u4f60\u97f3\u4e50\u64ad\u653e\u5668',
    regionSplashVolAria: '\u6b22\u8fce\u5c4f\u5e55 - \u97f3\u91cf',
    regionSplashHeroAria: '\u6b22\u8fce\u5c4f\u5e55 - \u6807\u9898',
    regionSplashStartAria: '\u6b22\u8fce\u5c4f\u5e55 - \u5f00\u59cb',
    orpetronSotdTip: 'Orpetron Award',
    orpetronSotdAria: 'Orpetron',
    designNomineesSotdTip: 'Design Nominees Award',
    designNomineesSotdAria: 'Design Nominees',
    awwwardsNomineeTip: 'Awwwards',
    awwwardsNomineeAria: 'Awwwards'
  };
}

applyChineseLanguageSlotDefault();

const BGS_LANG_KEY = 'bgs_lang';
const BGS_LANG_DEFAULT_MIGRATION_KEY = 'bgs_lang_default_zh_v3';
/** BIO: Ses seviyesi 閳?Dil gibi saklan璋媟; Default splash, Default toolbar ve Pro Mode ortak kullan璋媟. */
const BGS_VOL_KEY = 'bgs_vol';
/** BIO: Ayn璋?sekmede Pro\'ya ge鑾絜rken (鏋歾ellikle mobil) LS g鐪塿enilmezse ses yede鑷抜 閳?pro-mode/script.js ile ayn璋?anahtar. */
const BGS_VOL_SESSION_KEY = 'bgs_vol_session';

function readStoredVolume01() {
  let v;
  try {
    v = parseFloat(localStorage.getItem(BGS_VOL_KEY));
    if (!isNaN(v)) return Math.max(0, Math.min(1, v));
  } catch (_) { /* BIO: noop */ }
  try {
    v = parseFloat(sessionStorage.getItem(BGS_VOL_SESSION_KEY));
    if (!isNaN(v)) return Math.max(0, Math.min(1, v));
  } catch (_) { /* BIO: noop */ }
  return 0.7;
}

function persistVolumeToStorage(level) {
  const s = Math.max(0, Math.min(1, level)).toFixed(3);
  try { localStorage.setItem(BGS_VOL_KEY, s); } catch (_) { /* BIO: noop */ }
  try { sessionStorage.setItem(BGS_VOL_SESSION_KEY, s); } catch (_) { /* BIO: noop */ }
}

(function readStoredLangFromSharedKey() {
  try {
    if (localStorage.getItem(BGS_LANG_DEFAULT_MIGRATION_KEY) !== '1') {
      currentLang = 'de';
      localStorage.setItem(BGS_LANG_KEY, 'de');
      localStorage.setItem(BGS_LANG_DEFAULT_MIGRATION_KEY, '1');
      return;
    }
    const s = localStorage.getItem(BGS_LANG_KEY);
    if (s === 'tr') currentLang = 'en';
    else if (s && UI[s]) currentLang = s;
  } catch (_) { /* BIO: noop */ }
})();

function updateStatusDate() {
  const loc = UI[currentLang].locale;
  document.getElementById('status').textContent = new Date().toLocaleDateString(loc, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function _a11yGid(id) {
  return document.getElementById(id);
}

function syncFsAriaLabelsDefault() {
  const u = UI[currentLang];
  const fsBtn = _a11yGid('tb-fs');
  if (!fsBtn || !u) return;
  const fullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
  fsBtn.setAttribute('aria-label', fullscreen ? u.fsExitAria : u.fsEnterAria);
  fsBtn.setAttribute('aria-pressed', fullscreen ? 'true' : 'false');
}

function syncDefaultA11yOverview() {
  const u = UI[currentLang];
  const sk = _a11yGid('default-skip-overview');
  if (sk) sk.textContent = u.skipToOverview;
  const h1 = _a11yGid('default-overview-h1');
  if (h1) h1.textContent = u.overviewTitle;
  const lead = _a11yGid('default-overview-lead');
  if (lead) lead.textContent = u.overviewLead;
  const onav = _a11yGid('default-overview-nav');
  if (onav) onav.setAttribute('aria-label', u.overviewNavAria);
  const proL = _a11yGid('default-overview-pro-link');
  if (proL) proL.textContent = u.overviewProLink;
  const treeH = _a11yGid('default-a11y-tree-h2');
  if (treeH) treeH.textContent = u.overviewTreeHeading;
  const treeP = _a11yGid('default-overview-tree-note');
  if (treeP) treeP.textContent = u.overviewTreeNote;
  const toolbar = _a11yGid('toolbar');
  if (toolbar) toolbar.setAttribute('aria-label', u.toolbarAria);
  const hud = document.getElementById('hud');
  if (hud) {
    hud.setAttribute('role', 'region');
    hud.setAttribute('aria-label', u.regionHudAria);
  }
  const mainVolZone = document.getElementById('main-vol');
  if (mainVolZone) {
    mainVolZone.setAttribute('role', 'region');
    mainVolZone.setAttribute('aria-label', u.regionMediaAria);
  }
  ;['splash-vol-wrap', 'splash-content', 'splash-start-wrap'].forEach(zoneId => {
    const zone = document.getElementById(zoneId);
    if (!zone || !u) return;
    zone.setAttribute('role', 'region');
    let lab = '';
    if (zoneId === 'splash-vol-wrap') lab = u.regionSplashVolAria;
    else if (zoneId === 'splash-content') lab = u.regionSplashHeroAria;
    else if (zoneId === 'splash-start-wrap') lab = u.regionSplashStartAria;
    if (lab) zone.setAttribute('aria-label', lab);
  });
  const svgT = _a11yGid('svg');
  if (svgT) svgT.setAttribute('aria-label', u.svgTreeAria);
  const bb = _a11yGid('bb');
  if (bb) {
    bb.textContent = u.back;
    bb.setAttribute('aria-label', u.backAria);
  }
  const holoX = _a11yGid('holo-close');
  if (holoX) holoX.setAttribute('aria-label', u.holoCloseAria);
  const li = _a11yGid('splash-vol-range');
  if (li) li.setAttribute('aria-label', u.masterVolAria);
  const ma = _a11yGid('main-vol-range');
  if (ma) ma.setAttribute('aria-label', u.masterVolAria);
  const msk = _a11yGid('mp-seek');
  if (msk) msk.setAttribute('aria-label', u.seekAria);
  const ia1 = _a11yGid('intro-skip');
  if (ia1) ia1.setAttribute('aria-label', u.intro1SkipAria);
  const mpp = _a11yGid('mp-prev');
  const mpn = _a11yGid('mp-next');
  const mpl = _a11yGid('mp-play');
  if (mpp) {
    mpp.setAttribute('aria-label', u.mpPrevAria);
    mpp.setAttribute('title', u.mpPrevAria);
  }
  if (mpn) {
    mpn.setAttribute('aria-label', u.mpNextAria);
    mpn.setAttribute('title', u.mpNextAria);
  }
  if (mpl) {
    mpl.setAttribute('aria-label', u.mpPlayAria);
    mpl.setAttribute('title', u.mpPlayAria);
  }
  document.querySelectorAll('nav#toolbar a.tb-btn').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.includes('linkedin')) a.setAttribute('aria-label', u.linkedinAria);
    if (href.includes('github')) a.setAttribute('aria-label', u.githubAria);
  });
  const tbTr = _a11yGid('tb-trail');
  const tbGr = _a11yGid('tb-grid');
  if (tbTr) {
    tbTr.setAttribute('aria-label', u.trailToggleAria);
    tbTr.setAttribute('aria-pressed', tbTr.classList.contains('active') ? 'true' : 'false');
  }
  if (tbGr) {
    tbGr.setAttribute('aria-label', u.gridToggleAria);
    tbGr.setAttribute('aria-pressed', tbGr.classList.contains('active') ? 'true' : 'false');
  }
  syncFsAriaLabelsDefault();
  syncOrpetronSotdDefaultBadge();
  syncDesignNomineesSotdDefaultBadge();
  syncAwwwardsNomineeDefaultBadge();
}

function syncOrpetronSotdDefaultBadge() {
  const tip = document.getElementById('bgs-orpetron-sotd-tip');
  const a = document.getElementById('bgs-orpetron-sotd');
  if (!a || !tip) return;
  const u = UI[currentLang] || UI.en;
  a.setAttribute('aria-label', u.orpetronSotdAria);
  tip.textContent = u.orpetronSotdTip || '';
}

function syncDesignNomineesSotdDefaultBadge() {
  const tip = document.getElementById('bgs-design-nominees-sotd-tip');
  const a = document.getElementById('bgs-design-nominees-sotd');
  if (!a || !tip) return;
  const u = UI[currentLang] || UI.en;
  a.setAttribute('aria-label', u.designNomineesSotdAria);
  tip.textContent = u.designNomineesSotdTip || '';
}

function syncAwwwardsNomineeDefaultBadge() {
  const tip = document.getElementById('bgs-awwwards-nominee-sotd-tip');
  const a = document.getElementById('bgs-awwwards-nominee-sotd');
  if (!a || !tip) return;
  const u = UI[currentLang] || UI.en;
  a.setAttribute('aria-label', u.awwwardsNomineeAria);
  tip.textContent = u.awwwardsNomineeTip || '';
}

function initDefaultAwardBadgeUi(a, tip, tipKey, wireKey) {
  if (!a || !tip || a.dataset[wireKey] === '1') return;
  a.dataset[wireKey] = '1';

  const pad = 14;
  function positionTip(ev) {
    const u = UI[currentLang] || UI.en;
    tip.textContent = u[tipKey] || '';
    tip.hidden = false;
    const vx = typeof ev.clientX === 'number' ? ev.clientX : 0;
    const vy = typeof ev.clientY === 'number' ? ev.clientY : 0;
    let x = vx + pad;
    let y = vy + pad;
    const mw = tip.offsetWidth || 200;
    const mh = tip.offsetHeight || 36;
    x = Math.max(10, Math.min(x, window.innerWidth - mw - 10));
    y = Math.max(10, Math.min(y, window.innerHeight - mh - 10));
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }

  function hideTip() {
    tip.hidden = true;
  }

  a.addEventListener('pointerenter', positionTip);
  a.addEventListener('pointermove', positionTip);
  a.addEventListener('pointerleave', hideTip);
  a.addEventListener('blur', hideTip);

  a.addEventListener('auxclick', ev => {
    if (ev.button !== 1) return;
    const href = a.getAttribute('href');
    if (!href || !/^https?:\/\//i.test(href)) return;
    ev.preventDefault();
    try {
      window.open(href, '_blank', 'noopener,noreferrer');
    } catch (_errAux) {}
  });
}

function initOrpetronSotdDefaultBadgeUi() {
  initDefaultAwardBadgeUi(
    document.getElementById('bgs-orpetron-sotd'),
    document.getElementById('bgs-orpetron-sotd-tip'),
    'orpetronSotdTip',
    'bgsOrbWire'
  );
}

function initDesignNomineesSotdDefaultBadgeUi() {
  initDefaultAwardBadgeUi(
    document.getElementById('bgs-design-nominees-sotd'),
    document.getElementById('bgs-design-nominees-sotd-tip'),
    'designNomineesSotdTip',
    'bgsDnWire'
  );
}

function initAwwwardsNomineeDefaultBadgeUi() {
  initDefaultAwardBadgeUi(
    document.getElementById('bgs-awwwards-nominee-sotd'),
    document.getElementById('bgs-awwwards-nominee-sotd-tip'),
    'awwwardsNomineeTip',
    'bgsAwWire'
  );
}

function refreshSplashLabels() {
  const u = UI[currentLang];
  const $start = document.getElementById('splash-start');
  const $sub = document.getElementById('splash-sub');
  if ($start) $start.textContent = u.splashDesktopPro;
  if ($sub) $sub.textContent = u.splashTagline;
  const i2s = document.getElementById('intro2-skip');
  if (i2s) i2s.setAttribute('aria-label', u.intro2SkipAria);
  paintSplashGpuWarnTexts();
}

function paintSplashGpuWarnTexts(force) {
  const wrap = document.getElementById('splash-gpu-warn');
  if (!wrap || (!force && !wrap.classList.contains('open'))) return;
  const u = UI[currentLang];
  const lab = document.getElementById('sgw-stage-label');
  const ti = document.getElementById('sgw-title');
  const sb = document.getElementById('sgw-sub');
  const bd = document.getElementById('sgw-default');
  const bp = document.getElementById('sgw-pro');
  if (lab) lab.textContent = u.splashGpuWarnLabel;
  if (ti) ti.textContent = u.splashGpuWarnTitle;
  if (sb) sb.textContent = u.splashGpuWarnBody;
  if (bd) {
    bd.textContent = u.splashGpuDefaultBtn;
    bd.setAttribute('aria-label', u.splashGpuDefaultBtn);
  }
  if (bp) {
    bp.textContent = u.splashGpuProBtn;
    bp.setAttribute('aria-label', u.splashGpuProBtn);
  }
}

/* BIO: Return the current-language array from a multilingual label object */
function L(obj) { return obj[currentLang] || obj.tr; }

/* BIO: Implementation note for this section. */
const S = { level: 0, main: null, mainAng: 0, mainNx: 0, mainNy: 0 };
let vw = innerWidth, vh = innerHeight;
let cx = vw / 2,     cy = vh / 2;

/* BIO: Implementation note for this section. */
const $svg    = document.getElementById('svg');
const $cl     = document.getElementById('cl');
const $nl     = document.getElementById('nl');
const $fl     = document.getElementById('fl');
const $sl     = document.getElementById('sl');
const $scl    = document.getElementById('scl');
const $world  = document.getElementById('world');
const $bc     = document.getElementById('bc');
const $bb     = document.getElementById('bb');

/* BIO: Implementation note for this section. */
function _bcSyncRoot() {
  $bc.classList.toggle('at-root', !$bc.textContent.includes('>'));
}
_bcSyncRoot();
new MutationObserver(_bcSyncRoot).observe($bc, {
  childList: true, characterData: true, subtree: true
});
const $raySvg    = document.getElementById('ray-svg');
const $holo      = document.getElementById('holo');
const $holoTitle = document.getElementById('holo-title');
const $holoBody  = document.getElementById('holo-body');
const $holoClose = document.getElementById('holo-close');
const $holoSheetHandle = document.getElementById('holo-sheet-handle');
const $cur    = document.getElementById('cur');
const $intro  = document.getElementById('intro');
const $ifill  = document.getElementById('intro-fill');

(function bindDefaultA11ySkipLink() {
  const a = document.querySelector('a.skip-link[href^="#"]');
  if (!a || a.dataset.defaultSkipBound === '1') return;
  const href = a.getAttribute('href');
  const id = href && href.charAt(0) === '#' ? href.slice(1) : '';
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  a.dataset.defaultSkipBound = '1';
  a.addEventListener('click', () => {
    window.requestAnimationFrame(() => {
      try {
        target.focus({ preventScroll: true });
      } catch (_err) {
        target.focus();
      }
    });
  });
})();

let globalVolume = readStoredVolume01();

/* BIO: After splash Start / Fullscreen, intro1 ends 閳?navigate straight to /pro-mode/ */
let splashIntentDirectPro = false;

/* BIO: Audio, SFX, and mini-player behavior note. */
const PRO_SFX_METEOR_MIX = 0.8;
const PRO_SFX_CRACK_MIX = 0.55;

function applyProTransitionSfxVolume() {
  const g = typeof globalVolume === 'number' ? globalVolume : 0.7;
  try {
    const w = window;
    if (w.__meteorCrashSfxRef) {
      w.__meteorCrashSfxRef.volume = Math.min(1, PRO_SFX_METEOR_MIX * g);
    }
    if (w.__screenCrackSfxRef) {
      w.__screenCrackSfxRef.volume = Math.min(1, PRO_SFX_CRACK_MIX * g);
    }
    const v = document.getElementById('intro2-vid');
    if (v) v.volume = g;
  } catch (_e) { /* BIO: ignore */ }
}

/* BIO: Audio, SFX, and mini-player behavior note. */
const NODE_CLICK_MIX = 0.7;
let nodeClickBase = null;
function playNodeClick() {
  if (!nodeClickBase) {
    nodeClickBase = new Audio('assets/default/sfx/node-click.mp3');
    nodeClickBase.preload = 'auto';
  }
  const clone = nodeClickBase.cloneNode();
  clone.volume = Math.min(1, NODE_CLICK_MIX * globalVolume);
  const p = clone.play();
  if (p && typeof p.catch === 'function') p.catch(() => {});
}

/* BIO: Button layout and interaction note. */
const MAIN_NODE_MIX = 0.65;
let mainNodeBase = null;
function playMainNode() {
  if (!mainNodeBase) {
    mainNodeBase = new Audio('assets/default/sfx/main-node.mp3');
    mainNodeBase.preload = 'auto';
  }
  const clone = mainNodeBase.cloneNode();
  clone.volume = Math.min(1, MAIN_NODE_MIX * globalVolume);
  const p = clone.play();
  if (p && typeof p.catch === 'function') p.catch(() => {});
}

/* BIO: Hologram close (X button) + main-node click while a sub-node is open */
const NODE_CLOSE_MIX = 0.55;
let nodeCloseBase = null;
function playNodeClose() {
  if (!nodeCloseBase) {
    nodeCloseBase = new Audio('assets/default/sfx/node-close.mp3');
    nodeCloseBase.preload = 'auto';
  }
  const clone = nodeCloseBase.cloneNode();
  clone.volume = Math.min(1, NODE_CLOSE_MIX * globalVolume);
  const p = clone.play();
  if (p && typeof p.catch === 'function') p.catch(() => {});
}

const HOLO_OPEN_MIX = 0.55;
let holoOpenBase = null;
function playHoloOpen() {
  if (!holoOpenBase) {
    holoOpenBase = new Audio('assets/default/sfx/hologram-open.mp3');
    holoOpenBase.preload = 'auto';
  }
  const clone = holoOpenBase.cloneNode();
  clone.volume = Math.min(1, HOLO_OPEN_MIX * globalVolume);
  const p = clone.play();
  if (p && typeof p.catch === 'function') p.catch(() => {});
}

function primeAudioRef(createBase) {
  try {
    const a = createBase();
    a.preload = 'auto';
    a.load();
  } catch (_) { /* BIO: Ignore audio warm-up failures. */ }
}

function warmDefaultModeRuntime() {
  primeAudioRef(() => {
    if (!nodeClickBase) nodeClickBase = new Audio('assets/default/sfx/node-click.mp3');
    return nodeClickBase;
  });
  primeAudioRef(() => {
    if (!mainNodeBase) mainNodeBase = new Audio('assets/default/sfx/main-node.mp3');
    return mainNodeBase;
  });
  primeAudioRef(() => {
    if (!nodeCloseBase) nodeCloseBase = new Audio('assets/default/sfx/node-close.mp3');
    return nodeCloseBase;
  });
  primeAudioRef(() => {
    if (!holoOpenBase) holoOpenBase = new Audio('assets/default/sfx/hologram-open.mp3');
    return holoOpenBase;
  });

  const warm = { t: 0 };
  gsap.to(warm, { t: 1, duration: 0.001, onComplete: () => { warm.t = 0; } });
}

function scheduleDefaultModeWarmup() {
  const run = () => warmDefaultModeRuntime();
  if ('requestIdleCallback' in window) {
    requestIdleCallback(run, { timeout: 1200 });
  } else {
    setTimeout(run, 500);
  }
}

/* BIO: Implementation note for this section. */
const NS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs) {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

/* BIO: Create an animated connection line */
function mkLine(x1, y1, x2, y2, color, opacity = 0.5) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return svgEl('line', {
    x1, y1, x2, y2,
    stroke: color,
    'stroke-width': 2.5,
    'stroke-opacity': opacity,
    'stroke-dasharray': len,
    'stroke-dashoffset': len,
    style: `filter:drop-shadow(0 0 3px ${color})`
  });
}

let ufoPhotoRevealed = false;

function onSvgPortfolioNodeKeydown(e) {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  const g = e.currentTarget;
  try {
    g.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }));
  } catch (_err) {
    g.click();
  }
}

function attachSvgPortfolioNodeSemantics(g, lines) {
  const arr = Array.isArray(lines) ? lines : [String(lines)];
  const label = arr.join(' ').trim();
  if (label) g.setAttribute('aria-label', label);
  g.setAttribute('role', 'button');
  g.setAttribute('tabindex', '0');
  if (g.dataset.a11yNodeBound === '1') return;
  g.dataset.a11yNodeBound = '1';
  g.addEventListener('keydown', onSvgPortfolioNodeKeydown);
}

/* BIO: Create a node group with circle + optional photo + text */
function mkNode(id, x, y, r, color, lines, type) {
  const g = svgEl('g', { id: `n-${id}`, class: 'ng' });
  gsap.set(g, { x, y });  // BIO: GSAP owns positioning

  // BIO: Outer pulse ring
  const ring = svgEl('circle', {
    r: r + 12, cx: 0, cy: 0,
    fill: 'none', stroke: color,
    'stroke-width': 1, 'stroke-opacity': 0.15,
    style: `filter:drop-shadow(0 0 4px ${color})`
  });

  // BIO: Inner accent ring (small)
  const ring2 = svgEl('circle', {
    r: r - 8, cx: 0, cy: 0,
    fill: 'none', stroke: color,
    'stroke-width': 0.5, 'stroke-opacity': 0.2
  });

  // BIO: Main background circle
  const circ = svgEl('circle', {
    r, cx: 0, cy: 0,
    stroke: color,
    'stroke-width': type === 'center' ? 2.5 : 2,
    style: `fill:var(--node-bg);filter:drop-shadow(0 0 ${type === 'center' ? 12 : 8}px ${color})`
  });

  g.appendChild(ring);
  g.appendChild(circ);
  if (r > 30) g.appendChild(ring2);

  if (type === 'center') {
    // BIO: Scale the avatar with the centre node so the framing stays right
    // BIO: on mobile (centerR = 68) and the original look on desktop (centerR = 105).
    /* BIO: Mobile-only smaller avatar so bilal2.webp does not dominate small screens. */
    const imgScale = IS_MOBILE ? 0.68 : 1;
    const imgW = Math.round(175 * imgScale);
    const imgH = Math.round(235 * imgScale);
    const imgY = -imgH + Math.round(28 * imgScale);
    const defs = $svg.querySelector('defs');
    const clipId = 'clip-avatar';
    if (!defs.querySelector(`#${clipId}`)) {
      const cp = svgEl('clipPath', { id: clipId });
      cp.appendChild(svgEl('rect', {
        x: -imgW / 2, y: imgY,
        width: imgW, height: imgH,
        rx: 8, ry: 8
      }));
      defs.appendChild(cp);
    }
    const avatar = svgEl('image', {
      x: -imgW / 2, y: imgY, width: imgW, height: imgH,
      href: 'assets/default/common/bilal2.webp',
      'clip-path': `url(#${clipId})`,
      preserveAspectRatio: 'xMidYMid slice',
      'pointer-events': 'none'
    });
    const avatarGroup = svgEl('g', { class: 'center-avatar' });
    avatarGroup.style.opacity = ufoPhotoRevealed ? '1' : '0';
    avatarGroup.appendChild(avatar);

    const t = svgEl('text', {
      x: 0, y: IS_MOBILE ? 24 : 35,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: color, 'font-family': 'Orbitron,sans-serif',
      'font-size': IS_MOBILE ? 11 : 17, 'font-weight': 700
    });
    t.textContent = lines.join(' ');

    g.appendChild(avatarGroup);
    g.appendChild(t);

  } else {
    // BIO: Text label
    const isMain = type === 'main';
    const ff  = isMain ? 'Orbitron,sans-serif' : 'Share Tech Mono,monospace';
    const fw  = isMain ? 700 : 400;
    let   fs  = isMain ? (lines.length > 1 ? 11 : 13) : (lines.length > 1 ? 11 : 14);
    if (IS_MOBILE) fs = isMain ? 9 : 9;
    const gap = IS_MOBILE ? 12 : 17;

    lines.forEach((line, i) => {
      const t = svgEl('text', {
        x: 0, y: (i - (lines.length - 1) / 2) * gap,
        'text-anchor': 'middle', 'dominant-baseline': 'middle',
        fill: color, 'font-family': ff, 'font-size': fs, 'font-weight': fw
      });
      t.textContent = line;
      g.appendChild(t);
    });
  }

  attachSvgPortfolioNodeSemantics(g, lines);

  return { g, circ, ring };
}

/* BIO: Implementation note for this section. */
function addHover(g, circ, ring, color, r) {
  g.addEventListener('mouseenter', () => {
    $cur.classList.add('hov');
    gsap.to(circ, { attr: { r: r * 1.1 }, duration: .2 });
    gsap.to(ring, { attr: { 'stroke-opacity': .4 }, duration: .2 });
    circ.style.filter = `drop-shadow(0 0 20px ${color})`;
  });
  g.addEventListener('mouseleave', () => {
    $cur.classList.remove('hov');
    gsap.to(circ, { attr: { r }, duration: .2 });
    gsap.to(ring, { attr: { 'stroke-opacity': .15 }, duration: .2 });
    circ.style.filter = `drop-shadow(0 0 ${r > 50 ? 12 : 8}px ${color})`;
  });
}

/* BIO: Implementation note for this section. */
function ripple(x, y, color) {
  const c = svgEl('circle', {
    cx: x, cy: y, r: 8,
    fill: 'none', stroke: color,
    'stroke-width': 3, opacity: .9
  });
  $fl.appendChild(c);
  gsap.to(c, { attr: { r: 112 }, opacity: 0, duration: .7, ease: 'power2.out', onComplete: () => c.remove() });
}

/* BIO: Implementation note for this section. */
function clear() { $cl.innerHTML = ''; $scl.innerHTML = ''; $nl.innerHTML = ''; $sl.innerHTML = ''; }

/* BIO: Implementation note for this section. */
function renderRoot(anim = true) {
  clear();
  const R = Math.min(330, Math.min(cx, cy) * 0.70);

  // BIO: Mobile: shrink the whole tree so 5 nodes + the centre fit a 375px screen
  // BIO: without overlapping. Desktop sizing is unchanged.
  const centerR = IS_MOBILE ? 68  : 105;
  const mainR   = IS_MOBILE ? 42  : 62;
  const { g: cg, circ: cc, ring: cr } = mkNode('root', cx, cy, centerR, '#00f5ff', L(DATA.label), 'center');
  $nl.appendChild(cg);
  addHover(cg, cc, cr, '#00f5ff', centerR);
  cg.addEventListener('click', () => { if (S.level === 1) collapseNode(); });

  DATA.nodes.forEach((nd, i) => {
    const ang = (-90 + 72 * i) * Math.PI / 180;
    const nx  = cx + R * Math.cos(ang);
    const ny  = cy + R * Math.sin(ang);

    // BIO: Connection line
    const line = mkLine(cx, cy, nx, ny, nd.color);
    line.id = `l-${nd.id}`;
    $cl.appendChild(line);

    // BIO: Node
    const { g, circ, ring } = mkNode(nd.id, nx, ny, mainR, nd.color, L(nd.label), 'main');
    $nl.appendChild(g);
    addHover(g, circ, ring, nd.color, mainR);
    g.addEventListener('click', () => {
      const sameNode = S.level === 1 && S.main && S.main.id === nd.id;
      if (holoOpen) {
        playNodeClose();
      } else if (!sameNode) {
        playNodeClick();
      }
      expandNode(nd, nx, ny, ang);
    });

    if (anim) {
      gsap.set(g, { opacity: 0, scale: 0 });
      gsap.to(g,    { opacity: 1, scale: 1,      duration: .6, delay: .15 + i * .09, ease: 'back.out(1.7)' });
      gsap.to(line, { attr: { 'stroke-dashoffset': 0 }, duration: .7, delay: .1 + i * .09, ease: 'power2.out' });
    } else {
      gsap.set(g, { opacity: 1, scale: 1 });
      line.setAttribute('stroke-dashoffset', 0);
    }
  });

  /* BIO: SVG paint order follows DOM order 閳?move center above mains so avatar/hair is not covered by overlaps (e.g. About Me). */
  $nl.appendChild(cg);

  if (anim) {
    gsap.set(cg, { opacity: 0, scale: 0 });
    gsap.to(cg, { opacity: 1, scale: 1, duration: .8, ease: 'back.out(1.7)' });
  } else {
    gsap.set(cg, { opacity: 1, scale: 1 });
  }

  S.level = 0; S.main = null;
  $bc.textContent = UI[currentLang].tree;
  $bb.textContent = UI[currentLang].back;
  $bb.style.display = 'none';
  closeHolo();
}

/* BIO: Implementation note for this section. */
function expandNode(nd, nx, ny, ang, anim = true) {
  closeHolo();
  expandBaseWorldX = cx - nx;
  expandBaseWorldY = cy - ny;

  if (S.level === 1 && S.main && S.main.id === nd.id) {
    gsap.to($world, { x: expandBaseWorldX, y: expandBaseWorldY, duration: 0.35, ease: 'power2.inOut' });
    $bc.textContent = `${UI[currentLang].tree}  閳? ${L(nd.label).join(' ')}`;
    return;
  }

  // BIO: If switching from another expanded node, reset instantly before re-expanding
  if (S.level === 1) {
    $scl.innerHTML = '';
    $sl.innerHTML  = '';
    DATA.nodes.forEach(n => {
      const g = document.getElementById(`n-${n.id}`);
      const l = document.getElementById(`l-${n.id}`);
      if (g) gsap.set(g, { opacity: 1, scale: 1 });
      if (l) gsap.set(l, { opacity: 1 });
    });
  }

  if (anim) ripple(nx, ny, nd.color);

  // BIO: Dim every other main node and its connection line
  DATA.nodes.forEach(n => {
    if (n.id !== nd.id) {
      const g = document.getElementById(`n-${n.id}`);
      const l = document.getElementById(`l-${n.id}`);
      if (anim) {
        if (g) gsap.to(g, { opacity: 0.22, duration: .3 });
        if (l) gsap.to(l, { opacity: 0.12, duration: .3 });
      } else {
        if (g) gsap.set(g, { opacity: 0.22 });
        if (l) gsap.set(l, { opacity: 0.12 });
      }
    }
  });

  // BIO: Scale up selected main node
  const selG = document.getElementById(`n-${nd.id}`);
  if (selG) {
    if (anim) gsap.to(selG, { scale: 1.14, duration: .3, ease: 'back.out(1.7)' });
    else      gsap.set(selG, { scale: 1.14 });
  }

  S.level = 1; S.main = nd; S.mainAng = ang; S.mainNx = nx; S.mainNy = ny;
  $bc.textContent = `${UI[currentLang].tree}  閳? ${L(nd.label).join(' ')}`;
  $bb.textContent = UI[currentLang].back;
  $bb.style.display = 'block';

  // BIO: Pan view so the selected node sits at screen center
  if (anim) {
    gsap.to($world, { x: cx - nx, y: cy - ny, duration: .55, ease: 'power2.inOut' });
  } else {
    gsap.set($world, { x: cx - nx, y: cy - ny });
  }

  renderSubsAt(nd, nx, ny, ang, anim);
}

/* BIO: Implementation note for this section. */
function renderSubsAt(nd, nx, ny, ang, anim = true) {
  $scl.innerHTML = '';
  $sl.innerHTML  = '';

  const count      = nd.subs.length;
  const R_sub      = Math.min(230, Math.min(cx, cy) * 0.60);
  const spreadRad  = (count > 1 ? Math.min(115, (count - 1) * 42) : 0) * Math.PI / 180;
  const step       = count > 1 ? spreadRad / (count - 1) : 0;

  // BIO: Sub nodes match the smaller main-tree scale on mobile.
  const subR = IS_MOBILE ? 32 : 48;

  nd.subs.forEach((sub, i) => {
    const subAng = ang + (-spreadRad / 2 + step * i);
    const sx = nx + R_sub * Math.cos(subAng);
    const sy = ny + R_sub * Math.sin(subAng);

    // BIO: Connection line goes into $scl (behind main nodes in $nl)
    const line = mkLine(nx, ny, sx, sy, nd.color, .45);
    $scl.appendChild(line);

    // BIO: Sub node (slightly smaller radius)
    const { g, circ, ring } = mkNode(sub.id, sx, sy, subR, nd.color, L(sub.label), 'sub');
    $sl.appendChild(g);
    addHover(g, circ, ring, nd.color, subR);
    g.addEventListener('click', () => {
      const sameSub = holoOpen && currentSubId === sub.id;
      if (!sameSub) playHoloOpen();
      ripple(sx, sy, nd.color);
      openPanel(sub, nd.color, sx, sy, subAng);
    });

    if (anim) {
      gsap.set(g, { opacity: 0, scale: 0 });
      gsap.to(g,    { opacity: 1, scale: 1,      duration: .45, delay: .3 + i * .09, ease: 'back.out(1.7)' });
      gsap.to(line, { attr: { 'stroke-dashoffset': 0 }, duration: .55, delay: .28 + i * .09, ease: 'power2.out' });
    } else {
      gsap.set(g, { opacity: 1, scale: 1 });
      line.setAttribute('stroke-dashoffset', 0);
    }
  });
}

/* BIO: Implementation note for this section. */
function collapseNode(anim = true) {
  playMainNode();
  closeHolo();

  const subGs = $sl.querySelectorAll('.ng');
  const subLs = $scl.querySelectorAll('line');

  if (anim) {
    subGs.forEach(g => gsap.to(g, { opacity: 0, scale: .2, duration: .25, ease: 'power2.in' }));
    subLs.forEach(l => gsap.to(l, { opacity: 0, duration: .2 }));

    // BIO: Pan view back to origin
    gsap.to($world, { x: 0, y: 0, duration: .45, ease: 'power2.inOut' });

    // BIO: Restore all main nodes and connection lines
    DATA.nodes.forEach(n => {
      const g = document.getElementById(`n-${n.id}`);
      const l = document.getElementById(`l-${n.id}`);
      if (g) gsap.to(g, { opacity: 1, scale: 1, duration: .3, delay: .15 });
      if (l) gsap.to(l, { opacity: 1, duration: .3, delay: .15 });
    });

    gsap.delayedCall(.45, () => { $scl.innerHTML = ''; $sl.innerHTML = ''; });
  } else {
    $scl.innerHTML = '';
    $sl.innerHTML  = '';
    gsap.set($world, { x: 0, y: 0 });
    DATA.nodes.forEach(n => {
      const g = document.getElementById(`n-${n.id}`);
      const l = document.getElementById(`l-${n.id}`);
      if (g) gsap.set(g, { opacity: 1, scale: 1 });
      if (l) gsap.set(l, { opacity: 1 });
    });
  }

  S.level = 0; S.main = null;
  $bc.textContent = UI[currentLang].tree;
  $bb.style.display = 'none';
}

/* BIO: Hologram panel behavior and rendering note. */
let holoOpen         = false;
let holoFocusReturn  = null;
let currentSubId     = null;
let holoTwTimer      = null;
let expandBaseWorldX = 0;
let expandBaseWorldY = 0;
let scanTween        = null;  // BIO: GSAP tween for beam scan sweep
let cornerPositions  = {};    // BIO: screen coords of #holo corner brackets

function killRaysImmediate() {
  if (scanTween) { scanTween.kill(); scanTween = null; }
  gsap.killTweensOf($raySvg);
  $raySvg.innerHTML = '';
}

function openPanel(sub, color, sx, sy, subAng = 0) {
  if (holoTwTimer) { clearInterval(holoTwTimer); holoTwTimer = null; }
  killRaysImmediate();

  // BIO: Populate trusted, author-controlled static content only.
  // BIO: Do not route URL params, CMS data, or visitor input into this sink.
  $holoBody.innerHTML = (typeof sub.html === 'object') ? (sub.html[currentLang] || sub.html.tr) : sub.html;
  $holoTitle.textContent = '';

  // BIO: Tint border/glow with node color
  const borderColor = color + '99';
  const glowColor   = color + '48';
  $holo.style.borderColor = borderColor;
  $holo.style.boxShadow   = `0 0 30px ${glowColor}, inset 0 0 60px ${color}0d`;

  // BIO: Clear any lingering GSAP state, then show briefly to measure real panel height
  gsap.killTweensOf($holo);
  gsap.set($holo, { clearProps: 'all' });
  $holo.style.display = 'block';
  $holo.style.opacity = '0';

  const panelW = $holo.offsetWidth || 400;
  const panelH = $holo.scrollHeight || 340;
  const nodeR  = 56;
  const gap    = 20;

  if (IS_MOBILE) {
    // BIO: 閳光偓閳光偓 Mobile: holo lives as a bottom-sheet positioned by CSS 閳光偓閳光偓
    // BIO: Don't pan the world toward an off-screen panel; just keep the
    // BIO: selected node centred (already set by expandNode). Skip rays
    // BIO: entirely 閳?they assume free-floating panel geometry.
    $holo.style.left = '';
    $holo.style.top  = '';

    gsap.killTweensOf($holo);
    gsap.set($holo, {
      opacity: 0, scale: 1, x: 0, y: 0, z: 0, rotateX: 0,
      transformPerspective: 800
    });

    cornerPositions = {};
    $holo.querySelectorAll('.holo-corner').forEach(el => {
      const r = el.getBoundingClientRect();
      cornerPositions[el.dataset.corner] = {
        x: r.left, y: r.top,
        cx: r.left + r.width / 2,
        cy: r.top  + r.height / 2,
        width: r.width, height: r.height
      };
    });

    // BIO: Slide up from below 閳?the natural gesture for a bottom sheet.
    gsap.fromTo($holo,
      { opacity: 0, y: 40, scale: 0.98 },
      { opacity: 1, y: 0,  scale: 1, duration: 0.32, ease: 'power3.out' }
    );
  } else {
    // BIO: 閳光偓閳光偓 Camera pan: always relative to the base expand position, never accumulates 閳光偓閳光偓
    const cosA = Math.cos(subAng);
    const sinA = Math.sin(subAng);

    const panelDist = 350;

    // BIO: Step 1: tentative screen position with base pan (180px) to detect overflow
    const basePanX   = -cosA * 180;
    const basePanY   = -sinA * 180;
    const tentScreenX = sx + expandBaseWorldX + basePanX;
    const tentScreenY = sy + expandBaseWorldY + basePanY;
    const tentLeft    = (tentScreenX + panelDist * cosA) - panelW / 2;
    const tentTop     = (tentScreenY + panelDist * sinA) - panelH / 2;

    // BIO: Step 2: measure how far the panel would bleed outside the viewport
    const overflowLeft   = Math.max(0, 12 - tentLeft);
    const overflowRight  = Math.max(0, tentLeft + panelW + 12 - vw);
    const overflowTop    = Math.max(0, 64 - tentTop);
    const overflowBottom = Math.max(0, tentTop + panelH + 36 - vh);

    // BIO: Step 3: extend pan to push the panel back inside
    const extraPanX = overflowRight - overflowLeft;
    const extraPanY = overflowBottom - overflowTop;

    const targetWorldX = expandBaseWorldX + basePanX - extraPanX;
    const targetWorldY = expandBaseWorldY + basePanY - extraPanY;
    gsap.killTweensOf($world);
    gsap.to($world, { x: targetWorldX, y: targetWorldY, duration: 0.35, ease: 'power2.out' });

    // BIO: Screen coords of the node after the corrected pan settles
    const screenX = sx + targetWorldX;
    const screenY = sy + targetWorldY;

    // BIO: 閳光偓閳光偓 Panel position: centre along subAng at panelDist from node 閳光偓閳光偓
    const panelCX = screenX + panelDist * cosA;
    const panelCY = screenY + panelDist * sinA;

    let left = panelCX - panelW / 2;
    left = Math.max(12, Math.min(left, vw - panelW - 12));

    let top = panelCY - panelH / 2;
    top = Math.max(64, Math.min(top, vh - panelH - 36));

    $holo.style.left = left + 'px';
    $holo.style.top  = top  + 'px';

    // BIO: Entry animation: panel arrives from the subAng direction (camera pans, panel follows)
    const fromX = cosA * 30;
    const fromY = sinA * 30;

    // BIO: Final pose + invisible: same geometry as after entrance so clip matches. Rays first, then holo reveals.
    gsap.killTweensOf($holo);
    gsap.set($holo, {
      opacity: 0,
      scale: 1, x: 0, y: 0, z: 0, rotateX: 8, transformPerspective: 800
    });

    const rayOpts = sub.id === 'bio' ? { forceCorners: ['bl', 'br'], clip: true, clipPad: 12 }
                  : sub.id === 'edu' ? { forceCorners: ['bl', 'br'], clip: true }
                  : sub.id === 'web' ? { forceCorners: ['bl', 'br'], clip: true, clipPad: 14 }
                  : { clip: true, clipPad: 10 };
    const hr = $holo.getBoundingClientRect();
    drawRays(screenX, screenY, hr.left, hr.top, hr.width, hr.height, color, rayOpts);

    // BIO: 閳光偓閳光偓 Record corner bracket screen positions (after final-pose transform) 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
    cornerPositions = {};
    $holo.querySelectorAll('.holo-corner').forEach(el => {
      const r = el.getBoundingClientRect();
      cornerPositions[el.dataset.corner] = {
        x: r.left, y: r.top,
        cx: r.left + r.width  / 2,
        cy: r.top  + r.height / 2,
        width: r.width, height: r.height
      };
    });

    // BIO: 閳光偓閳光偓 Animate in 閳?slight delay so pan and panel open overlap naturally 閳光偓閳光偓
    gsap.fromTo($holo,
      { opacity: 0, scale: 0.35, x: fromX, y: fromY,
        z: -60, rotateX: 12, transformPerspective: 800 },
      { opacity: 1, scale: 1,    x: 0,      y: 0,
        z:   0, rotateX:  8, transformPerspective: 800,
        duration: 0.35, ease: 'power3.out', delay: 0.05 }
    );

    // BIO: Glitch: brief skew oscillation
    gsap.fromTo($holo,
      { skewX: 3 },
      { skewX: 0, duration: 0.28, ease: 'steps(4)', delay: 0.05 }
    );
  }

  holoOpen = true;
  currentSubId = sub.id;

  holoFocusReturn = document.activeElement instanceof Element ? document.activeElement : null;
  $holo.setAttribute('aria-hidden', 'false');
  gsap.delayedCall(0.42, () => {
    try {
      $holoClose.focus({ preventScroll: true });
    } catch (_e) {
      try {
        $holoClose.focus();
      } catch (__e2) {
        /* BIO: noop */
      }
    }
  });

  // BIO: 閳光偓閳光偓 Typewriter title 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
  const titleText = `[ ${L(sub.title)} ]`;
  const twDelay   = Math.max(18, Math.floor(400 / titleText.length));
  let i = 0;
  $holoTitle.setAttribute('aria-busy', 'true');
  holoTwTimer = setInterval(() => {
    i++;
    $holoTitle.textContent = titleText.slice(0, i);
    if (i >= titleText.length) {
      clearInterval(holoTwTimer);
      holoTwTimer = null;
      $holoTitle.removeAttribute('aria-busy');
    }
  }, twDelay);

  // BIO: 閳光偓閳光偓 Breadcrumb 閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓閳光偓
  if (S.main) $bc.textContent = `${UI[currentLang].tree}  閳? ${L(S.main.label).join(' ')}  閳? ${L(sub.label).join(' ')}`;
}

/* BIO: Hologram panel behavior and rendering note. */
function drawRays(x1, y1, rectLeft, rectTop, pW, pH, color, opts = {}) {
  if (scanTween) { scanTween.kill(); scanTween = null; }
  gsap.killTweensOf($raySvg);
  $raySvg.innerHTML = '';

  const ox = opts.offsetX || 0;
  const oy = opts.offsetY || 0;

  const cornerMap = {
    tl: { x: rectLeft,      y: rectTop      },
    tr: { x: rectLeft + pW, y: rectTop      },
    bl: { x: rectLeft,      y: rectTop + pH },
    br: { x: rectLeft + pW, y: rectTop + pH },
  };

  let c1, c2;
  if (opts.forceCorners) {
    c1 = cornerMap[opts.forceCorners[0]];
    c2 = cornerMap[opts.forceCorners[1]];
  } else {
    const corners = Object.values(cornerMap);
    corners.forEach(c => { c.dist = Math.hypot(c.x - x1, c.y - y1); });
    corners.sort((a, b) => a.dist - b.dist);
    [c1, c2] = corners;
  }

  c1.x += ox; c1.y += oy;
  c2.x += ox; c2.y += oy;

  const midX = (c1.x + c2.x) / 2;
  const midY = (c1.y + c2.y) / 2;

  const SVGNS = 'http://www.w3.org/2000/svg';
  const wrapper = document.createElementNS(SVGNS, 'g');
  const defs    = document.createElementNS(SVGNS, 'defs');

  // BIO: 閳光偓閳光偓 Shared gradient: bright at node, transparent at panel edge 閳光偓閳光偓
  const grad = document.createElementNS(SVGNS, 'linearGradient');
  grad.setAttribute('id', 'ray-grad');
  grad.setAttribute('gradientUnits', 'userSpaceOnUse');
  grad.setAttribute('x1', x1);   grad.setAttribute('y1', y1);
  grad.setAttribute('x2', midX); grad.setAttribute('y2', midY);
  const mkStop = (offset, opacity) => {
    const s = document.createElementNS(SVGNS, 'stop');
    s.setAttribute('offset', offset);
    s.setAttribute('stop-color', color);
    s.setAttribute('stop-opacity', opacity);
    return s;
  };
  grad.appendChild(mkStop('0%',   '1.0'));
  grad.appendChild(mkStop('35%',  '0.75'));
  grad.appendChild(mkStop('70%',  '0.3'));
  grad.appendChild(mkStop('100%', '0.0'));
  defs.appendChild(grad);

  // BIO: 閳光偓閳光偓 Blur filters: soft ambient / mid volume / hot core 閳光偓閳光偓
  const mkFilter = (id, std) => {
    const f = document.createElementNS(SVGNS, 'filter');
    f.setAttribute('id', id);
    f.setAttribute('x', '-100%'); f.setAttribute('y', '-100%');
    f.setAttribute('width', '300%'); f.setAttribute('height', '300%');
    const b = document.createElementNS(SVGNS, 'feGaussianBlur');
    b.setAttribute('in', 'SourceGraphic');
    b.setAttribute('stdDeviation', std);
    f.appendChild(b);
    return f;
  };
  defs.appendChild(mkFilter('ray-soft', '22'));
  defs.appendChild(mkFilter('ray-mid',  '8'));
  defs.appendChild(mkFilter('ray-hot',  '3'));

  if (opts.clip) {
    const pad = opts.clipPad != null ? opts.clipPad : 8;
    const cp = document.createElementNS(SVGNS, 'clipPath');
    cp.setAttribute('id', 'ray-clip');
    const bg = document.createElementNS(SVGNS, 'rect');
    bg.setAttribute('x', '0'); bg.setAttribute('y', '0');
    bg.setAttribute('width', vw); bg.setAttribute('height', vh);
    const hole = document.createElementNS(SVGNS, 'rect');
    hole.setAttribute('x', rectLeft - pad); hole.setAttribute('y', rectTop - pad);
    hole.setAttribute('width', pW + pad * 2); hole.setAttribute('height', pH + pad * 2);
    cp.setAttribute('clip-rule', 'evenodd');
    cp.appendChild(bg); cp.appendChild(hole);
    defs.appendChild(cp);
    wrapper.setAttribute('clip-path', 'url(#ray-clip)');
  }

  wrapper.appendChild(defs);

  // BIO: 閳光偓閳光偓 Helper: cone triangle at fraction f of full fan-width 閳光偓閳光偓
  const conePts = (f) => {
    const ax = midX + (c1.x - midX) * f;
    const ay = midY + (c1.y - midY) * f;
    const bx = midX + (c2.x - midX) * f;
    const by = midY + (c2.y - midY) * f;
    return `${x1},${y1} ${ax},${ay} ${bx},${by}`;
  };
  const mkPoly = (pts, fill, opacity, filterId) => {
    const p = document.createElementNS(SVGNS, 'polygon');
    p.setAttribute('points', pts);
    p.setAttribute('fill', fill);
    p.setAttribute('fill-opacity', opacity);
    if (filterId) p.setAttribute('filter', `url(#${filterId})`);
    return p;
  };

  // BIO: Layer 1 閳?wide ambient spill (full fan, heavy blur, very dim)
  wrapper.appendChild(mkPoly(conePts(1.0), color,             '0.18', 'ray-soft'));
  // BIO: Layer 2 閳?main beam volume (full fan, medium blur, gradient)
  wrapper.appendChild(mkPoly(conePts(1.0), 'url(#ray-grad)', '0.30', 'ray-mid'));
  // BIO: Layer 3 閳?tighter inner beam (55% fan, slight blur, gradient)
  wrapper.appendChild(mkPoly(conePts(0.55), 'url(#ray-grad)', '0.50', 'ray-hot'));
  // BIO: Layer 4 閳?hot core strip (20% fan, slight blur, solid color)
  wrapper.appendChild(mkPoly(conePts(0.20), color,             '0.75', 'ray-hot'));
  // BIO: Layer 5 閳?laser centre (5% fan, no blur, pure solid)
  wrapper.appendChild(mkPoly(conePts(0.05), color,             '0.95', null));

  // BIO: 閳光偓閳光偓 Scan sweep (moves from node toward panel, repeating) 閳光偓閳光偓閳光偓閳光偓
  const scanGlow = document.createElementNS(SVGNS, 'polygon');
  scanGlow.setAttribute('fill', color);
  scanGlow.setAttribute('fill-opacity', '0');
  scanGlow.setAttribute('filter', 'url(#ray-hot)');
  wrapper.appendChild(scanGlow);

  const scanCore = document.createElementNS(SVGNS, 'polygon');
  scanCore.setAttribute('fill', color);
  scanCore.setAttribute('fill-opacity', '0');
  wrapper.appendChild(scanCore);

  const scanW = 0.07; // BIO: strip thickness as fraction of beam length
  const lerp  = (a, b, f) => a + (b - a) * f;

  const setScanPts = (t) => {
    const t1 = Math.max(0, t - scanW / 2);
    const t2 = Math.min(1, t + scanW / 2);
    const ax1 = lerp(x1, c1.x, t1), ay1 = lerp(y1, c1.y, t1);
    const bx1 = lerp(x1, c2.x, t1), by1 = lerp(y1, c2.y, t1);
    const ax2 = lerp(x1, c1.x, t2), ay2 = lerp(y1, c1.y, t2);
    const bx2 = lerp(x1, c2.x, t2), by2 = lerp(y1, c2.y, t2);
    const p = `${ax1},${ay1} ${bx1},${by1} ${bx2},${by2} ${ax2},${ay2}`;
    scanGlow.setAttribute('points', p);
    scanCore.setAttribute('points', p);
  };
  setScanPts(0);

  const scanProxy = { t: 0 };
  scanTween = gsap.to(scanProxy, {
    t: 1,
    duration: 1.8,
    repeat: -1,
    repeatDelay: 0.9,
    ease: 'sine.inOut',
    delay: 0.15,
    onUpdate() {
      setScanPts(scanProxy.t);
      const alpha = Math.sin(scanProxy.t * Math.PI); // BIO: peaks at midpoint
      scanGlow.setAttribute('fill-opacity', (alpha * 0.50).toFixed(3));
      scanCore.setAttribute('fill-opacity', (alpha * 0.95).toFixed(3));
    }
  });

  $raySvg.appendChild(wrapper);

  gsap.fromTo(wrapper,
    { opacity: 0 },
    { opacity: 1, duration: 0.18, ease: 'power2.out' }
  );
}

function clearRays() {
  if (scanTween) { scanTween.kill(); scanTween = null; }
  const g = $raySvg.firstElementChild;
  if (!g) return;
  gsap.killTweensOf(g);
  gsap.to(g, {
    opacity: 0, duration: 0.15, ease: 'power2.in',
    onComplete: () => { $raySvg.innerHTML = ''; }
  });
}

function closeHolo() {
  if (!holoOpen) return;
  if (holoTwTimer) { clearInterval(holoTwTimer); holoTwTimer = null; }
  $holoTitle.removeAttribute('aria-busy');
  clearRays();

  const restoreEl = holoFocusReturn;
  holoFocusReturn = null;

  gsap.killTweensOf($holo);
  const hideHoloEl = () => {
    $holo.style.display = 'none';
    $holo.setAttribute('aria-hidden', 'true');
    gsap.set($holo, { clearProps: 'transform,opacity' });
    if (restoreEl && typeof restoreEl.focus === 'function') {
      try {
        restoreEl.focus({ preventScroll: true });
      } catch (_e) {
        try {
          restoreEl.focus();
        } catch (__e2) {
          /* BIO: noop */
        }
      }
    }
  };
  if (IS_MOBILE) {
    const dist = ($holo.getBoundingClientRect().height || 380) + Math.max(32, window.innerHeight * 0.06);
    gsap.to($holo, {
      y: dist,
      opacity: 0,
      scale: 1,
      rotateX: 0,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: hideHoloEl
    });
  } else {
    gsap.to($holo, {
      opacity: 0, scale: 0.8, z: 30, rotateX: 0, transformPerspective: 800,
      duration: 0.2, ease: 'power2.in',
      onComplete: hideHoloEl
    });
  }

  holoOpen = false;
  currentSubId = null;
  if (S.main) {
    $bc.textContent = `${UI[currentLang].tree}  閳? ${L(S.main.label).join(' ')}`;
    gsap.to($world, { x: expandBaseWorldX, y: expandBaseWorldY, duration: 0.4, ease: 'power2.inOut' });
  }
}

$holoClose.addEventListener('click', () => {
  if (holoOpen) playNodeClose();
  closeHolo();
});

/* BIO: Mobil 閳?hologram 鐪塻t tutamac璋媙dan a鑹鑷掕皨 s鐪塺鐪塳leyerek kapatma (alt sayfa UX). */
(function bindMobileHoloSheetSwipe() {
  if (!IS_MOBILE || !$holoSheetHandle) return;

  const CLOSE_DIST_PX = 80;
  /** px/ms 閳?h璋媧l璋?a鑹鑷掕皨 f璋媟latma ile kapat */
  const CLOSE_VEL = 0.45;

  let drag = null;

  function snapOpen() {
    gsap.to($holo, {
      y: 0,
      opacity: 1,
      duration: 0.24,
      ease: 'power3.out'
    });
  }

  function onPointerDown(e) {
    if (!holoOpen) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    try {
      e.preventDefault();
    } catch (_err) { /* passive listener yok */ }
    gsap.killTweensOf($holo);
    drag = {
      id: e.pointerId,
      sy: e.clientY,
      lastY: e.clientY,
      lastT: typeof performance !== 'undefined' ? performance.now() : Date.now(),
      vy: 0
    };
    try {
      $holoSheetHandle.setPointerCapture(e.pointerId);
    } catch (_err2) { /* ignore */ }
  }

  function onPointerMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!holoOpen) {
      drag = null;
      return;
    }
    try {
      e.preventDefault();
    } catch (_err) { /* ignore */ }
    const dy = e.clientY - drag.sy;
    const y = dy > 0 ? dy : 0;
    const fade = 1 - Math.min(0.38, y / 220);
    gsap.set($holo, { y, opacity: fade });
    const t = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const dt = Math.max(5, t - drag.lastT);
    drag.vy = (e.clientY - drag.lastY) / dt;
    drag.lastY = e.clientY;
    drag.lastT = t;
  }

  function onPointerEnd(e) {
    if (!drag || e.pointerId !== drag.id) return;
    try {
      $holoSheetHandle.releasePointerCapture(e.pointerId);
    } catch (_err) { /* ignore */ }

    const y = Number(gsap.getProperty($holo, 'y')) || 0;
    const flickDown = drag.vy > CLOSE_VEL;
    const shouldClose = y > CLOSE_DIST_PX || flickDown;
    drag = null;

    if (shouldClose) {
      if (holoOpen) playNodeClose();
      closeHolo();
      return;
    }
    snapOpen();
  }

  function onLostCapture() {
    drag = null;
    if (holoOpen) snapOpen();
  }

  const opts = { passive: false };
  $holoSheetHandle.addEventListener('pointerdown', onPointerDown, opts);
  $holoSheetHandle.addEventListener('pointermove', onPointerMove, opts);
  $holoSheetHandle.addEventListener('pointerup', onPointerEnd);
  $holoSheetHandle.addEventListener('pointercancel', onPointerEnd);
  $holoSheetHandle.addEventListener('lostpointercapture', onLostCapture);
})();

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || e.repeat) return;
  const pv = document.getElementById('photo-viewer');
  if (pv && pv.classList.contains('active')) return;
  const pcw = document.getElementById('pro-confirm');
  if (pcw && pcw.classList.contains('open')) return;
  const gw = document.getElementById('splash-gpu-warn');
  if (gw && gw.classList.contains('open')) return;
  if (holoOpen) {
    e.preventDefault();
    playNodeClose();
    closeHolo();
  }
});

function holoOrderedFocusTargets() {
  if (!$holo || holoOpen === false) return [];
  /* BIO: Hidden via display:none when closed 閳?gsap animation may still hide 閳?check computed style where possible. */
  const styleDisplay = typeof window.getComputedStyle === 'function' ? window.getComputedStyle($holo).display : $holo.style.display;
  if (styleDisplay === 'none') return [];
  const out = [];
  if ($holoClose) out.push($holoClose);
  $holoBody.querySelectorAll(
    'a[href]:not([tabindex="-1"]), button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])'
  ).forEach(el => out.push(el));
  return out;
}

document.addEventListener('keydown', e => {
  if (!holoOpen || e.key !== 'Tab') return;
  const list = holoOrderedFocusTargets().filter(Boolean);
  if (list.length < 2) return;
  const first = list[0];
  const last = list[list.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else if (document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* BIO: Button layout and interaction note. */
$bb.addEventListener('click', () => collapseNode());

/* BIO: Audio, SFX, and mini-player behavior note. */
if (!IS_MOBILE) {
  document.addEventListener('mousemove', e => {
    $cur.style.left = e.clientX + 'px';
    $cur.style.top  = e.clientY + 'px';
    spawnTrail(e.clientX, e.clientY);
    spawnGridCell(e.clientX, e.clientY);
  });
}

/* BIO: Implementation note for this section. */
const $trail   = document.getElementById('cursor-trail');
const trailCtx = $trail.getContext('2d');
const trails   = [];

function resizeTrail() { $trail.width = innerWidth; $trail.height = innerHeight; }
resizeTrail();

function spawnTrail(x, y) {
  if (!trailEnabled) return;
  const count = 2;
  for (let i = 0; i < count; i++) {
    trails.push({
      x:   x + (Math.random() - 0.5) * 8,
      y:   y + (Math.random() - 0.5) * 8,
      r:   Math.random() * 2.5 + 1,
      life: 1,
      decay: 0.025 + Math.random() * 0.02,
      vx:  (Math.random() - 0.5) * 0.4,
      vy:  (Math.random() - 0.5) * 0.4
    });
  }
  if (trails.length > 120) trails.splice(0, trails.length - 120);
}

(function animTrail() {
  trailCtx.clearRect(0, 0, $trail.width, $trail.height);
  for (let i = trails.length - 1; i >= 0; i--) {
    const t = trails[i];
    t.life -= t.decay;
    t.x += t.vx;
    t.y += t.vy;
    if (t.life <= 0) { trails.splice(i, 1); continue; }
    trailCtx.save();
    trailCtx.globalAlpha = t.life * 0.55;
    trailCtx.shadowBlur  = 10;
    trailCtx.shadowColor = 'rgba(0,228,237,0.7)';
    trailCtx.fillStyle   = `rgba(0,228,237,${t.life})`;
    trailCtx.beginPath();
    trailCtx.arc(t.x, t.y, t.r * t.life, 0, Math.PI * 2);
    trailCtx.fill();
    trailCtx.restore();
  }
  requestAnimationFrame(animTrail);
})();

/* BIO: Implementation note for this section. */
const $gridTrail = document.getElementById('grid-trail');
const gridCtx    = $gridTrail.getContext('2d');
const gridCells  = [];
const GRID       = 55;
let lastGX = -1, lastGY = -1;

function resizeGridTrail() { $gridTrail.width = innerWidth; $gridTrail.height = innerHeight; }
resizeGridTrail();

function spawnGridCell(mx, my) {
  if (!gridTrailEnabled) return;
  const gx = Math.floor(mx / GRID);
  const gy = Math.floor(my / GRID);
  if (gx === lastGX && gy === lastGY) return;
  lastGX = gx; lastGY = gy;

  const existing = gridCells.find(c => c.gx === gx && c.gy === gy);
  if (existing) { existing.life = 1; return; }

  gridCells.push({ gx, gy, x: gx * GRID, y: gy * GRID, life: 1, decay: 0.020 });
  if (gridCells.length > 35) gridCells.splice(0, gridCells.length - 35);
}

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

(function animGridTrail() {
  gridCtx.clearRect(0, 0, $gridTrail.width, $gridTrail.height);
  for (let i = gridCells.length - 1; i >= 0; i--) {
    const c = gridCells[i];
    c.life -= c.decay;
    if (c.life <= 0) { gridCells.splice(i, 1); continue; }

    const pad = 3;
    const alpha = c.life * 0.18;

    gridCtx.save();
    gridCtx.globalAlpha = alpha;
    gridCtx.shadowBlur  = 22;
    gridCtx.shadowColor = 'rgba(0,228,237,0.6)';
    gridCtx.fillStyle   = '#00E4ED';
    drawRoundRect(gridCtx, c.x + pad, c.y + pad, GRID - pad * 2, GRID - pad * 2, 10);
    gridCtx.fill();
    gridCtx.restore();
  }
  requestAnimationFrame(animGridTrail);
})();

/* BIO: Implementation note for this section. */
const pcv   = document.getElementById('pc');
const pctx  = pcv.getContext('2d');
const COLORS = ['#00f5ff', '#ff006e', '#00ff88', '#bf00ff', '#ffee00'];

function resizePC() { pcv.width = innerWidth; pcv.height = innerHeight; }
resizePC();

const particles = Array.from({ length: IS_MOBILE ? 28 : 75 }, () => ({
  x:  Math.random() * pcv.width,
  y:  Math.random() * pcv.height,
  vx: (Math.random() - .5) * .35,
  vy: (Math.random() - .5) * .35,
  r:  Math.random() * 1.7 + .3,
  a:  Math.random() * .42 + .07,
  c:  COLORS[Math.floor(Math.random() * COLORS.length)]
}));

(function animParticles() {
  pctx.clearRect(0, 0, pcv.width, pcv.height);
  particles.forEach(p => {
    p.x = (p.x + p.vx + pcv.width)  % pcv.width;
    p.y = (p.y + p.vy + pcv.height) % pcv.height;
    pctx.save();
    pctx.globalAlpha = p.a;
    pctx.shadowBlur  = 8;
    pctx.shadowColor = p.c;
    pctx.fillStyle   = p.c;
    pctx.beginPath();
    pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pctx.fill();
    pctx.restore();
  });
  requestAnimationFrame(animParticles);
})();

/* BIO: Implementation note for this section. */
window.addEventListener('resize', () => {
  vw = innerWidth; vh = innerHeight;
  cx = vw / 2;    cy = vh / 2;
  resizePC();
  resizeTrail();
  resizeGridTrail();

  // BIO: Skip tree render during intro video (prevents double-render flash on
  // BIO: fullscreen-entry resize before the main site is supposed to appear).
  if (!siteReady) return;

  if (S.level === 0) {
    renderRoot(false);
  } else if (S.level === 1 && S.main) {
    const savedMain = S.main;
    renderRoot(false); // BIO: clears everything, resets S.level = 0
    const idx = DATA.nodes.findIndex(n => n.id === savedMain.id);
    if (idx !== -1) {
      const R   = Math.min(330, Math.min(cx, cy) * 0.70);
      const ang = (-90 + 72 * idx) * Math.PI / 180;
      const nx  = cx + R * Math.cos(ang);
      const ny  = cy + R * Math.sin(ang);
      expandNode(savedMain, nx, ny, ang, false);
    }
  }
});

/* BIO: Language control and localization note. */
function reExpand(savedMain) {
  renderRoot(false);
  const idx = DATA.nodes.findIndex(n => n.id === savedMain.id);
  if (idx !== -1) {
    const R   = Math.min(330, Math.min(cx, cy) * 0.70);
    const ang = (-90 + 72 * idx) * Math.PI / 180;
    const nx  = cx + R * Math.cos(ang);
    const ny  = cy + R * Math.sin(ang);
    expandNode(savedMain, nx, ny, ang, false);
  }
}

function setLang(lang) {
  if (lang === 'tr') lang = 'en';
  currentLang = lang;
  try { localStorage.setItem(BGS_LANG_KEY, lang); } catch (_) { /* BIO: noop */ }
  try { localStorage.setItem(BGS_LANG_DEFAULT_MIGRATION_KEY, '1'); } catch (_) { /* BIO: noop */ }
  document.documentElement.lang = lang;
  document.querySelectorAll('.tb-lang').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang)
  );
  document.querySelectorAll('.tb-mode').forEach(b => {
    b.textContent = b.dataset.mode === 'pro' ? UI[lang].modePro : UI[lang].modeDefault;
  });
  document.getElementById('intro-sub').textContent = UI[lang].boot;
  refreshSplashLabels();
  updateStatusDate();
  if (S.level === 0) {
    renderRoot(false);
  } else if (S.level === 1 && S.main) {
    reExpand(S.main);
  }
  try {
    const pcw = document.getElementById('pro-confirm');
    if (pcw && pcw.classList.contains('open') && pcStage >= 1 && pcStage <= 3) {
      const pdata = (PRO_CONFIRM[lang] || PRO_CONFIRM.en)[pcStage - 1];
      const pl = document.getElementById('pc-stage-label');
      const pt = document.getElementById('pc-title');
      const py = document.getElementById('pc-yes');
      const pn = document.getElementById('pc-no');
      const ps = document.getElementById('pc-sub');
      if (pl) pl.textContent = pdata.label;
      if (pt) pt.textContent = pdata.title;
      if (py) py.textContent = pdata.yes;
      if (pn) pn.textContent = pdata.no;
      if (pcStage === 2) refreshProConfirmStage2Subtext();
      else if (ps) ps.textContent = pdata.sub;
    }
  } catch (_) {
    /* BIO: Pro Mode integration note. */
  }
  syncDefaultLandscapeHint();
  syncDefaultA11yOverview();
}

function setTheme(theme) {
  currentTheme = theme;
  document.body.classList.toggle('light', theme === 'light');
  if (S.level === 0) {
    renderRoot(false);
  } else if (S.level === 1 && S.main) {
    reExpand(S.main);
  }
}

/* BIO: Implementation note for this section. */
document.querySelectorAll('.tb-lang').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});
setLang(currentLang);
initOrpetronSotdDefaultBadgeUi();
initDesignNomineesSotdDefaultBadgeUi();
initAwwwardsNomineeDefaultBadgeUi();

/* BIO: Hologram panel behavior and rendering note. */
document.querySelectorAll('.tb-mode').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (btn.classList.contains('active')) return;
    if (mode === 'pro') {
      goToProModeDirect();
    } else {
      document.querySelectorAll('.tb-mode').forEach(b =>
        b.classList.toggle('active', b === btn)
      );
    }
  });
});

/* BIO: Audio, SFX, and mini-player behavior note. */
const PRO_CONFIRM = {
  tr: [
    { label: 'ONAY  /  01',           title: "PRO MOD'A GE鑴烳EK 闄孲T闄孻OR MUSUN?",     sub: 'Farkl璋?bir d鐪塶yaya ge鑾絠鑹?yapacaks璋媙.',                      yes: 'EVET',        no: 'HAYIR' },
    { label: 'UYARI  /  02',          title: 'EM闄孨 M闄孲闄孨? GER闄?D鑴癗鑴鸿墻鑴?KOLAY DE鑷戦檶L.',                                                  yes: 'EVET, EM闄孨闄孧', no: '闄孭TAL' },
    { label: 'FINAL WARNING / 03', title: 'LAST CHANCE. READY?', sub: 'This is the final question. Are you sure?', yes: 'LAUNCH', no: 'CANCEL' }
  ],
  en: [
    { label: 'CONFIRM  /  01',        title: 'DO YOU WANT TO SWITCH TO PRO MODE?',   sub: 'You are about to enter a different world.',                 yes: 'YES',          no: 'NO' },
    { label: 'WARNING  /  02',        title: 'ARE YOU SURE? NOT EASY TO UNDO.',                                                                      yes: 'YES, I AM SURE', no: 'CANCEL' },
    { label: '閳? FINAL WARNING  /  03', title: 'LAST CHANCE. READY?',                sub: 'This is my final question. Is the answer final?',           yes: 'LAUNCH',       no: 'ABORT' }
  ],
  de: [
    { label: 'BEST鑴汿IGEN  /  01',     title: 'WILLST DU IN DEN PRO-MODUS WECHSELN?', sub: 'Du betrittst gleich eine andere Welt.',                     yes: 'JA',           no: 'NEIN' },
    { label: 'ACHTUNG  /  02',        title: 'BIST DU SICHER? NICHT LEICHT R鑴篊KG鑴汵GIG.',                                                             yes: 'JA, SICHER',   no: 'ABBRECHEN' },
    { label: '閳? LETZTE WARNUNG  /  03', title: 'LETZTE CHANCE. BEREIT?',             sub: 'Das ist meine letzte Frage. Entscheidung endg鐪塴tig.',       yes: 'STARTEN',      no: 'VERWERFEN' }
  ]
};

const $pcWrap  = document.getElementById('pro-confirm');
const $pcPanel = document.getElementById('pc-panel');
const $pcLabel = document.getElementById('pc-stage-label');
const $pcTitle = document.getElementById('pc-title');
const $pcSub   = document.getElementById('pc-sub');
const $pcYes   = document.getElementById('pc-yes');
const $pcNo    = document.getElementById('pc-no');

/* BIO: Hologram panel behavior and rendering note. */
const PRO_CONFIRM_SUB2_LOADING = {
  tr: 'Calculating Pro Mode download size...',
  en: 'Calculating Pro Mode download size...',
  de: '正在计算专业模式下载大小...'
};
const PRO_CONFIRM_SUB2_FALLBACK = {
  tr: 'Pro Mode 鑾給k veri indirir. Emin misin?',
  en: 'Pro Mode downloads a lot of data. Are you sure?',
  de: 'Pro Mode l鐩瞕t viele Daten. Bist du sicher?'
};
/* BIO: Implementation note for this section. */
const PRO_CONFIRM_SUB2_WITH_MB = {
  tr: 'Pro Mode {mb} MB i鑾絜riyor, emin misin?',
  en: 'Pro Mode contains {mb} MB. Are you sure?',
  de: 'Pro Mode umfasst ca. {mb} MB. Bist du sicher?'
};

let _proPayloadBytes = null; /* BIO: null = not measured yet; -1 = measurement failed; >=0 bytes. */
let _proPayloadPromise = null;
let _proPayloadUiThenAttached = false;

function proPayloadAbsoluteUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  const base = `${window.location.origin}/`;
  return new URL(path.replace(/^\//, ''), base).href;
}

function getProModePayloadUrls() {
  const threeV = '0.170.0';
  const urls = [
    'styles.css',
    'pro-mode/styles.css',
    'pro-mode/script.js',
    'pro-mode/cockpit-3d.js',
    'pro-mode/pong-mini.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    `https://unpkg.com/three@${threeV}/build/three.module.js`,
    `https://unpkg.com/three@${threeV}/examples/jsm/loaders/GLTFLoader.js`,
    `https://unpkg.com/three@${threeV}/examples/jsm/libs/meshopt_decoder.module.js`,
    `https://unpkg.com/three@${threeV}/examples/jsm/renderers/CSS3DRenderer.js`,
    ...(IS_MOBILE
      ? [`https://unpkg.com/three@${threeV}/examples/jsm/loaders/KTX2Loader.js`]
      : []),
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap',
    'assets/default/music/track1.ogg',
    'assets/default/music/track2.ogg',
    'assets/default/music/track3.ogg',
    'assets/default/hobbies/shooting.webp',
    'assets/default/hobbies/shooting2.webp',
    'assets/default/hobbies/espor.webp',
    'assets/default/hobbies/espor3.webp',
    'assets/default/common/favicon.svg',
    'assets/default/common/bio-logo.webp'
  ];
  const sfx = [
    'cockpitopen',
    'buttonhover',
    'buttonclick',
    'planethover',
    'planetbuttonclick',
    'hologramtyping',
    'planetgoback',
    'radiovoice',
    'radiocloseopen',
    'mail3dmodel',
    'maphover',
    'mapclick',
    'pongballhitsuser',
    'pongballhitswall',
    'ponggamewinlose'
  ];
  sfx.forEach((name) => urls.push(`assets/pro/sfx/${name}.mp3`));
  urls.push(
    IS_MOBILE ? 'assets/pro/cockpit/cockpit-mobile.glb' : 'assets/pro/cockpit/cockpit-optimized.glb',
    'assets/pro/cockpit/cockpit.webp',
    'assets/pro/aboutme/aboutme-texture.webp',
    'assets/pro/aboutme/subnode-education-texture.webp',
    'assets/pro/aboutme/subnode-experience-texture.webp',
    'assets/pro/aboutme/subnode-aboutme-texture.webp',
    IS_MOBILE ? 'assets/pro/aboutme/university-mobile.glb' : 'assets/pro/aboutme/university-optimized.glb',
    'assets/pro/my-projects/my-projects-texture.webp',
    'assets/pro/my-projects/subnode-cybersecurity.webp',
    'assets/pro/my-projects/subnode-ai.webp',
    'assets/pro/my-projects/subnode-mixed.webp',
    'assets/pro/hobbies/hobbies-texture.webp',
    'assets/pro/hobbies/subnode-esport.webp',
    'assets/pro/hobbies/subnode-shooting.webp',
    'assets/pro/hobbies/subnode-tech.webp',
    'assets/pro/hobbies/subnode-travel.webp',
    IS_MOBILE ? 'assets/pro/hobbies/shooting-mobile.glb' : 'assets/pro/hobbies/shooting-optimized.glb',
    'assets/pro/skills-interests/skillsinterests-texture.webp',
    'assets/pro/skills-interests/subnode-ai.webp',
    'assets/pro/skills-interests/subnode-cybersecurity.webp',
    'assets/pro/contact/contact-texture.webp',
    'assets/pro/contact/subnode-email.webp',
    'assets/pro/contact/subnode-social.webp',
    IS_MOBILE ? 'assets/pro/contact/mail-mobile.glb' : 'assets/pro/contact/mail-optimized.glb',
    IS_MOBILE ? 'assets/pro/contact/linkedin-mobile.glb' : 'assets/pro/contact/linkedin-optimized.glb',
    IS_MOBILE ? 'assets/pro/contact/github-mobile.glb' : 'assets/pro/contact/github-optimized.glb',
    'assets/pro/common/BIO-LOGO-NOBG.webp',
    'assets/pro/common/frog.webp',
    'assets/pro/OrpetronSOTM.png',
    'assets/default/awwwards-nominee-defaultmode.png',
    'assets/pro/design-nominees.png',
    'assets/pro/common/map.webp'
  );
  if (!IS_MOBILE) urls.push('assets/pro/common/ufo-optimized.glb');
  return [...new Set(urls)];
}

async function fetchProAssetContentLength(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', mode: 'cors', cache: 'force-cache' });
    if (res.ok) {
      const cl = res.headers.get('Content-Length');
      if (cl) return parseInt(cl, 10);
    }
  } catch (_) { /* BIO: noop */ }
  return 0;
}

async function computeProModePayloadBytes() {
  const urls = getProModePayloadUrls().map(proPayloadAbsoluteUrl);
  const parts = await Promise.all(urls.map(fetchProAssetContentLength));
  return parts.reduce((a, b) => a + b, 0);
}

function startProModePayloadPrefetch() {
  if (!_proPayloadPromise) {
    _proPayloadPromise = computeProModePayloadBytes()
      .then((bytes) => {
        _proPayloadBytes = typeof bytes === 'number' && bytes > 0 ? bytes : -1;
        return _proPayloadBytes;
      })
      .catch(() => {
        _proPayloadBytes = -1;
        return -1;
      });
  }
  if (!_proPayloadUiThenAttached) {
    _proPayloadUiThenAttached = true;
    _proPayloadPromise.then(() => {
      if ($pcWrap && $pcWrap.classList.contains('open') && pcStage === 2) {
        refreshProConfirmStage2Subtext();
      }
    });
  }
}

function refreshProConfirmStage2Subtext() {
  if (!$pcSub || pcStage !== 2) return;
  const lang = currentLang in PRO_CONFIRM_SUB2_LOADING ? currentLang : 'en';
  if (_proPayloadBytes === null) {
    $pcSub.textContent = PRO_CONFIRM_SUB2_LOADING[lang];
    return;
  }
  if (_proPayloadBytes < 0) {
    $pcSub.textContent = PRO_CONFIRM_SUB2_FALLBACK[lang];
    return;
  }
  const mb = _proPayloadBytes / (1024 * 1024);
  const loc = lang === 'en' ? 'en-US' : lang === 'de' ? 'de-DE' : 'tr-TR';
  const fmt = new Intl.NumberFormat(loc, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(mb);
  const tpl = PRO_CONFIRM_SUB2_WITH_MB[lang] || PRO_CONFIRM_SUB2_WITH_MB.en;
  $pcSub.textContent = tpl.replace('{mb}', fmt);
}

let pcStage            = 0;
let proModeConfirmed   = false;   // BIO: true after final YES this load (plane suppression)
let pcConfirmFocusReturn = null;

/* BIO: Audio, SFX, and mini-player behavior note. */
const PRO_SKIP_SESSION_KEY = 'bgs_pro_drama_done_session';

(function initProSkipSessionGate() {
  try {
    localStorage.removeItem('bgs_pro_mode_unlocked'); /* BIO: legacy localStorage scheme */
    const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    const reload =
      (nav && nav.type === 'reload') ||
      (typeof performance.navigation !== 'undefined' && performance.navigation.type === 1);
    if (reload) sessionStorage.removeItem(PRO_SKIP_SESSION_KEY);
  } catch (_) { /* BIO: noop */ }
})();

function sessionAllowsProFastPath() {
  try {
    return sessionStorage.getItem(PRO_SKIP_SESSION_KEY) === '1';
  } catch (_) {
    return false;
  }
}

/* BIO: Pro Mode integration note. */
function goToProModeDirect() {
  if (typeof killPlane === 'function') killPlane();
  persistVolumeToStorage(typeof globalVolume === 'number' ? globalVolume : 0.7);
  try {
    if (IS_MOBILE) sessionStorage.setItem('bgs_mobile_pro', '1');
  } catch (_e) {
    /* BIO: noop */
  }
  window.location.href = 'pro-mode/';
}

const pcSfx            = { open: null, warn: null, alarm: null, confirm: null, cancel: null, uibtn: null };

function pcLoadSfx() {
  if (pcSfx.open) return;
  pcSfx.open    = new Audio('assets/default/sfx/hologram-open.mp3');
  pcSfx.warn    = new Audio('assets/default/sfx/switch-click.mp3');
  pcSfx.alarm   = new Audio('assets/default/sfx/red-alert.mp3');
  pcSfx.confirm = new Audio('assets/default/sfx/ufo-beam.mp3');
  pcSfx.cancel  = new Audio('assets/default/sfx/node-close.mp3');
  pcSfx.uibtn   = new Audio('assets/default/sfx/ui-button.mp3');
}
function pcPlay(name, mix = 0.55) {
  const base = pcSfx[name];
  if (!base) return;
  const c = base.cloneNode();
  c.volume = Math.min(1, mix * globalVolume);
  const p = c.play();
  if (p && typeof p.catch === 'function') p.catch(() => {});
}

/* BIO: Audio, SFX, and mini-player behavior note. */
const PC_ALARM_VOLUME = 0.10;   // BIO: tuned lower 閳?plays on every pulse
let pcAlarmListener = null;

function startPcAlarmLoop() {
  stopPcAlarmLoop();             // BIO: safety, in case something left the loop on
  playAlarmPulse();              // BIO: fire on the very first (visible) pulse

  pcAlarmListener = (e) => {
    if (e.animationName === 'pc-alarm') playAlarmPulse();
  };
  $pcPanel.addEventListener('animationiteration', pcAlarmListener);
}

function stopPcAlarmLoop() {
  if (pcAlarmListener) {
    $pcPanel.removeEventListener('animationiteration', pcAlarmListener);
    pcAlarmListener = null;
  }
  const a = pcSfx.alarm;
  if (!a) return;
  try { a.pause(); a.currentTime = 0; } catch (_) { /* BIO: noop */ }
}

function playAlarmPulse() {
  const a = pcSfx.alarm;
  if (!a) return;
  // BIO: restart from the top so each pulse feels like a fresh hit
  try { a.pause(); a.currentTime = 0; } catch (_) { /* BIO: noop */ }
  a.volume = Math.min(1, PC_ALARM_VOLUME * globalVolume);
  const p = a.play();
  if (p && typeof p.catch === 'function') p.catch(() => {});
}

function pcRenderStage(n) {
  pcStage = n;
  const data = (PRO_CONFIRM[currentLang] || PRO_CONFIRM.en)[n - 1];
  $pcPanel.dataset.stage = String(n);
  $pcWrap.dataset.stage  = String(n);
  $pcLabel.textContent = data.label;
  $pcTitle.textContent = data.title;
  if (n === 2) refreshProConfirmStage2Subtext();
  else $pcSub.textContent = data.sub;
  $pcYes.textContent   = data.yes;
  $pcNo.textContent    = data.no;
  if      (n === 1) pcPlay('open',  0.55);
  // BIO: Stage 2 intentionally silent 閳?drama without the extra sting
  else if (n === 3) startPcAlarmLoop();   // BIO: loops until confirm / cancel
  if ($pcWrap && $pcWrap.classList.contains('open')) {
    window.requestAnimationFrame(() => {
      try {
        $pcYes.focus({ preventScroll: true });
      } catch (_e) {
        try {
          $pcYes.focus();
        } catch (__e2) {
          /* BIO: noop */
        }
      }
    });
  }
}

function openProConfirm() {
  /* BIO: Audio, SFX, and mini-player behavior note. */
  if (proModeConfirmed || sessionAllowsProFastPath()) {
    document.querySelectorAll('.tb-mode').forEach(b =>
      b.classList.toggle('active', b.dataset.mode === 'pro')
    );
    goToProModeDirect();
    return;
  }
  // BIO: Pause the background music while the user deliberates
  if (typeof window.pauseMusicForProConfirm === 'function') {
    window.pauseMusicForProConfirm();
  }
  // BIO: Kill any plane currently flying across so it doesn't photobomb the drama
  if (typeof killPlane === 'function') killPlane();
  pcLoadSfx();
  startProModePayloadPrefetch();
  $pcPanel.classList.remove('launching');
  pcRenderStage(1);
  $pcWrap.classList.add('open');
  $pcWrap.setAttribute('aria-hidden', 'false');

  pcConfirmFocusReturn = document.activeElement instanceof Element ? document.activeElement : null;
  window.requestAnimationFrame(() => {
    try {
      $pcYes.focus({ preventScroll: true });
    } catch (_e) {
      try {
        $pcYes.focus();
      } catch (__e2) {
        /* BIO: noop */
      }
    }
  });

  // BIO: Warm intro2.mp4 up in the background while the user
  // BIO: reads the 3-stage drama 閳?so playback is instant later.
  try {
    const v = document.getElementById('intro2-vid');
    if (v && v.preload !== 'auto') {
      v.preload = 'auto';
      v.load();
    }
  } catch (_) { /* BIO: ignore */ }
}

function closeProConfirm(confirmed) {
  stopPcAlarmLoop();               // BIO: kill the red-alert loop on exit
  const focusBack = confirmed ? null : pcConfirmFocusReturn;
  pcConfirmFocusReturn = null;
  function tryRestorePcFocus(el) {
    if (!el || typeof el.focus !== 'function') return;
    window.requestAnimationFrame(() => {
      try {
        el.focus({ preventScroll: true });
      } catch (_e) {
        try {
          el.focus();
        } catch (__e2) {
          /* BIO: noop */
        }
      }
    });
  }
  if (confirmed) {
    // BIO: Brief "launching" flash before the next phase takes over
    $pcPanel.classList.add('launching');
    pcPlay('confirm', 0.75);
    proModeConfirmed = true;
    try { sessionStorage.setItem(PRO_SKIP_SESSION_KEY, '1'); } catch (_) {}
    document.querySelectorAll('.tb-mode').forEach(b =>
      b.classList.toggle('active', b.dataset.mode === 'pro')
    );
    setTimeout(() => {
      $pcWrap.classList.remove('open');
      $pcWrap.setAttribute('aria-hidden', 'true');
      $pcPanel.classList.remove('launching');
      triggerProTransition();
    }, 900);
  } else {
    pcPlay('cancel', 0.4);
    $pcWrap.classList.remove('open');
    $pcWrap.setAttribute('aria-hidden', 'true');
    tryRestorePcFocus(focusBack);
    // BIO: Resume music if it was playing before the confirm opened
    if (typeof window.resumeMusicForProConfirm === 'function') {
      window.resumeMusicForProConfirm();
    }
    // BIO: PRO was never activated 閳?DEFAULT stays active, nothing else to revert.
  }
}

/* BIO: Pro Mode integration note. */
const $meteorHit  = document.getElementById('meteor-hit');
const $meteorImg    = document.getElementById('meteor-img');
const $meteorFlash  = document.getElementById('meteor-flash');
const $meteorPredark= document.getElementById('meteor-predark');
const $meteorDust   = document.getElementById('meteor-dust');
const $screenCrack  = document.getElementById('screen-crack');
const $screenBlack  = document.getElementById('screen-black');
const $intro2Wrap = document.getElementById('intro2-video');
const $intro2Vid  = document.getElementById('intro2-vid');
const $intro2Skip = document.getElementById('intro2-skip');
let proEscapeRunning = false;

function lockPageForPro() {
  document.querySelectorAll(
    '.tb-mode, .tb-btn, .tb-lang, .tb-toggle, .mp-btn, #bb, #holo-close, #intro-skip'
  ).forEach(el => { el.style.pointerEvents = 'none'; });
}
function unlockPageAfterPro() {
  document.querySelectorAll(
    '.tb-mode, .tb-btn, .tb-lang, .tb-toggle, .mp-btn, #bb, #holo-close, #intro-skip'
  ).forEach(el => { el.style.pointerEvents = ''; });
}

function triggerProTransition() {
  if (proEscapeRunning) return;
  proEscapeRunning = true;

  lockPageForPro();

  Promise.resolve()
    .then(runMeteorImpact)
    .then(playIntro2)
    .then(finishProTransition)
    .catch((err) => {
      console.error('[PRO MODE] transition failed:', err);
      finishProTransition();
    });
}

/* BIO: Implementation note for this section. */
/* BIO: Implementation note for this section. */
function buildCrackPaths(cx, cy) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  $screenCrack.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
  $screenCrack.innerHTML = '';

  const NS = 'http://www.w3.org/2000/svg';
  const radial = 16;  // BIO: main radiating cracks
  const reach  = Math.hypot(vw, vh) * 0.55;

  for (let i = 0; i < radial; i++) {
    // BIO: base angle evenly distributed, with slight jitter
    const baseA = (i / radial) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
    const len   = reach * (0.55 + Math.random() * 0.55);
    const segs  = 6 + Math.floor(Math.random() * 4);
    const segLen= len / segs;

    let x = cx, y = cy, a = baseA;
    let d = `M ${cx.toFixed(1)} ${cy.toFixed(1)}`;
    for (let s = 0; s < segs; s++) {
      a += (Math.random() - 0.5) * 0.55;
      x += Math.cos(a) * segLen;
      y += Math.sin(a) * segLen;
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }

    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('stroke-width', (0.9 + Math.random() * 1.4).toFixed(2));
    path.setAttribute('opacity',      (0.55 + Math.random() * 0.45).toFixed(2));
    $screenCrack.appendChild(path);

    // BIO: 1-2 short branches shooting off the trunk
    const branches = 1 + Math.floor(Math.random() * 2);
    for (let b = 0; b < branches; b++) {
      const bStart = 2 + Math.floor(Math.random() * Math.max(1, segs - 3));
      // BIO: re-walk to branch start
      let bx = cx, by = cy, ba = baseA;
      for (let s = 0; s < bStart; s++) {
        ba += (Math.random() - 0.5) * 0.35;
        bx += Math.cos(ba) * segLen;
        by += Math.sin(ba) * segLen;
      }
      const bSegs = 2 + Math.floor(Math.random() * 3);
      let bAngle = baseA + (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.6);
      let bd = `M ${bx.toFixed(1)} ${by.toFixed(1)}`;
      for (let s = 0; s < bSegs; s++) {
        bAngle += (Math.random() - 0.5) * 0.5;
        bx += Math.cos(bAngle) * segLen * 0.85;
        by += Math.sin(bAngle) * segLen * 0.85;
        bd += ` L ${bx.toFixed(1)} ${by.toFixed(1)}`;
      }
      const bp = document.createElementNS(NS, 'path');
      bp.setAttribute('d', bd);
      bp.setAttribute('stroke-width', (0.6 + Math.random() * 0.9).toFixed(2));
      bp.setAttribute('opacity',      (0.4 + Math.random() * 0.4).toFixed(2));
      $screenCrack.appendChild(bp);
    }
  }
}

function runMeteorImpact() {
  return new Promise((resolve) => {
    $meteorHit.classList.add('active');

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cx = vw / 2;
    const cy = vh * 0.48;

    // BIO: meteor starting position 閳?off-screen top-right
    // BIO: img width is 640 (420 on mobile) 閳?centre it with half-width offset
    const meteorW = $meteorImg.offsetWidth || 640;
    const startX  = vw + 160;
    const startY  = -vh * 0.45;
    const endX    = cx - meteorW / 2;
    const endY    = cy - meteorW / 2;

    gsap.set($meteorImg,    { x: startX, y: startY, scale: 0.5, rotation: 0, opacity: 0 });
    gsap.set($meteorFlash,  { opacity: 0, scale: 0.4 });
    gsap.set($meteorPredark,{ opacity: 0 });
    gsap.set($screenCrack,  { opacity: 0 });
    gsap.set($screenBlack,  { opacity: 0 });
    $meteorDust.innerHTML = '';

    buildCrackPaths(cx, cy);
    // BIO: Start each crack path hidden (stroke-dash trick)
    Array.from($screenCrack.querySelectorAll('path')).forEach((p) => {
      const L = p.getTotalLength();
      p.style.strokeDasharray  = L;
      p.style.strokeDashoffset = L;
    });

    const tl = gsap.timeline({ onComplete: () => resolve() });

    // BIO: 0) pre-impact darkening 閳?shadow creeps in from the meteor's direction
    // BIO: Starts subtle, ramps up quickly as the meteor nears the ground.
    tl.to($meteorPredark, { opacity: 0.6, duration: 0.45, ease: 'power2.in'  }, 0.05);
    tl.to($meteorPredark, { opacity: 0.9, duration: 0.12, ease: 'power2.out' }, 0.5);

    // BIO: 1) meteor streaks in fast (0.5s, accelerating)
    tl.to($meteorImg, { opacity: 1, duration: 0.1,  ease: 'power1.out' }, 0);
    tl.to($meteorImg, {
      x: endX,
      y: endY,
      scale: 1.6,
      rotation: 18,
      duration: 0.5,
      ease: 'power3.in'
    }, 0);

    // BIO: 2) impact flash bloom
    tl.to($meteorFlash, { opacity: 1, scale: 1.05, duration: 0.12, ease: 'power2.out' }, 0.5);
    tl.to($meteorImg,   { opacity: 0, duration: 0.15, ease: 'power1.out' }, 0.5);
    tl.to($meteorFlash, { opacity: 0, duration: 0.45, ease: 'power2.in'  }, 0.65);

    // BIO: 3) camera shake + impact sfx + dust burst (meteor boom 閳?glass shatter)
    tl.add(() => {
      playMeteorCrashSfx();
      spawnMeteorDust(cx, cy);
      gsap.fromTo(document.body,
        { x: -10, y: 8 },
        { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.3)', clearProps: 'transform' }
      );
    }, 0.48);
    tl.add(() => {
      playScreenCrackSfx();
    }, 0.6);

    // BIO: 4) cracks draw in (staggered "shattering" feel)
    tl.to($screenCrack, { opacity: 1, duration: 0.08, ease: 'none' }, 0.52);
    tl.to('#screen-crack path', {
      strokeDashoffset: 0,
      duration: 0.45,
      stagger: { each: 0.012, from: 'random' },
      ease: 'power2.out'
    }, 0.52);

    // BIO: 5) darkening cascades straight out of the impact 閳?no pause.
    // BIO: Black starts fading in while the last cracks are still drawing,
    // BIO: so impact 閳?dust 閳?cracks 閳?darkness reads as one continuous beat.
    tl.to($screenBlack,  { opacity: 1, duration: 1.2, ease: 'power2.inOut' }, 0.85);
    tl.to($screenCrack,  { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 1.35);
    tl.to($meteorPredark,{ opacity: 0, duration: 0.5, ease: 'power2.out'  }, 1.7);

    // BIO: Short hold on full black before intro2 cuts in
    tl.to({}, { duration: 0.8 });
  });
}

/* BIO: Implementation note for this section. */
function spawnMeteorDust(cx, cy) {
  if (!$meteorDust) return;
  $meteorDust.innerHTML = '';

  const palette = [
    'rgba(255,190,95,0.92)',   // BIO: hot ember
    'rgba(255,130,50,0.85)',   // BIO: fire ember
    'rgba(255,80,25,0.8)',     // BIO: deep ember
    'rgba(210,200,185,0.8)',   // BIO: warm ash
    'rgba(160,160,160,0.78)',  // BIO: gray ash
    'rgba(85,85,90,0.85)',     // BIO: smoke
    'rgba(35,35,40,0.92)',     // BIO: soot
    'rgba(35,35,40,0.92)',
  ];

  const N = 80;
  for (let i = 0; i < N; i++) {
    const p = document.createElement('div');
    p.className = 'md-p';

    const size  = 2 + Math.random() * 7;
    const color = palette[Math.floor(Math.random() * palette.length)];
    const isEmber = color.startsWith('rgba(255');

    p.style.width  = size + 'px';
    p.style.height = size + 'px';
    p.style.background = color;
    if (isEmber) {
      p.style.boxShadow = `0 0 ${(size * 2.4).toFixed(1)}px rgba(255,140,40,0.75)`;
    }
    // BIO: place at impact center (top/left anchor, transform will do the rest)
    p.style.left = (cx - size / 2) + 'px';
    p.style.top  = (cy - size / 2) + 'px';

    $meteorDust.appendChild(p);

    // BIO: random trajectory: mostly outward with slight upward bias, then gravity pulls down
    const angle     = Math.random() * Math.PI * 2;
    const speed     = 180 + Math.random() * 780;
    const dx        = Math.cos(angle) * speed;
    const dyBurst   = Math.sin(angle) * speed * 0.7 - (40 + Math.random() * 80);
    const gravity   = 160 + Math.random() * 260;
    const life      = 1.4 + Math.random() * 1.8;
    const rot       = (Math.random() - 0.5) * 220;

    // BIO: x = outward momentum (decelerating)
    gsap.to(p, { x: dx, duration: life, ease: 'power3.out' });

    // BIO: y = two-phase arc: burst outward, then gravity pulls down
    const up = gsap.timeline();
    up.to(p, { y: dyBurst, duration: life * 0.4, ease: 'power2.out' })
      .to(p, { y: dyBurst + gravity, duration: life * 0.6, ease: 'power1.in' });

    // BIO: rotation + fade + gentle shrink
    gsap.to(p, {
      rotation: rot,
      opacity: 0,
      scale: 0.35 + Math.random() * 0.4,
      duration: life,
      ease: 'power2.out',
      onComplete: () => { if (p.parentNode) p.parentNode.removeChild(p); }
    });
  }
}

function playMeteorCrashSfx() {
  try {
    const a = new Audio('assets/default/sfx/meteor-crash.mp3');
    const g = typeof globalVolume === 'number' ? globalVolume : 0.7;
    a.volume = Math.min(1, PRO_SFX_METEOR_MIX * g);
    window.__meteorCrashSfxRef = a;
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
  } catch (_) { /* BIO: sfx missing is fine */ }
}

function playScreenCrackSfx() {
  try {
    const a = new Audio('assets/default/sfx/screen-crack.mp3');
    const g = typeof globalVolume === 'number' ? globalVolume : 0.7;
    a.volume = Math.min(1, PRO_SFX_CRACK_MIX * g);
    window.__screenCrackSfxRef = a;
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
  } catch (_) { /* BIO: sfx missing is fine */ }
}

/* BIO: Implementation note for this section. */
function playIntro2() {
  return new Promise((resolve) => {
    // BIO: Reveal video on top of the black screen so the cut is seamless
    $intro2Wrap.classList.add('active');
    $intro2Wrap.style.opacity = '1';

    try { $intro2Vid.load(); } catch (_) { /* BIO: ignore */ }
    $intro2Vid.currentTime = 0;
    $intro2Vid.muted  = false;
    $intro2Vid.volume = (typeof globalVolume === 'number') ? globalVolume : 0.7;

    const p = $intro2Vid.play();
    if (p && p.catch) p.catch(() => {
      // BIO: autoplay blocked 閳?fall back to muted playback
      $intro2Vid.muted = true;
      $intro2Vid.play().catch(() => {});
    });

    // BIO: reveal skip button after a beat
    setTimeout(() => { $intro2Skip.style.opacity = '1'; }, 600);

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      $intro2Vid.removeEventListener('ended', finish);
      $intro2Skip.removeEventListener('click', finish);
      resolve();
    };
    $intro2Vid.addEventListener('ended', finish);
    $intro2Skip.addEventListener('click', finish);
  });
}

/* BIO: Cockpit layout, rendering, and interaction note. */
function finishProTransition() {
  // BIO: Do not fade #intro2-video 閳?opacity tween lets Main Tree / layers below show through.
  // BIO: Meteor stack keeps #screen-black at 1; tear intro2 down instantly then navigate.
  try {
    gsap.killTweensOf($intro2Wrap);
  } catch (_) {}
  try {
    $intro2Vid.pause();
  } catch (_) {}
  $intro2Skip.style.opacity = '0';
  $intro2Wrap.style.opacity = '1';
  $intro2Wrap.classList.remove('active');
  gsap.set($screenBlack, { opacity: 1 });
  persistVolumeToStorage(typeof globalVolume === 'number' ? globalVolume : 0.7);
  try {
    if (IS_MOBILE) sessionStorage.setItem('bgs_mobile_pro', '1');
  } catch (_e) {
    /* BIO: noop */
  }
  window.location.href = 'pro-mode/';
}

$pcYes.addEventListener('click', () => {
  if ($pcPanel.classList.contains('launching')) return;
  if (pcStage < 3) {
    pcPlay('uibtn', 0.75);                    // BIO: YES on stage 1 & 2 閳?audible click
    pcRenderStage(pcStage + 1);
  } else {
    closeProConfirm(true);
  }
});
$pcNo.addEventListener('click', () => {
  if ($pcPanel.classList.contains('launching')) return;
  closeProConfirm(false);
});
document.getElementById('pc-backdrop').addEventListener('click', () => {
  if ($pcPanel.classList.contains('launching')) return;
  closeProConfirm(false);
});
document.addEventListener('keydown', (e) => {
  if (!$pcWrap.classList.contains('open')) return;
  if ($pcPanel.classList.contains('launching')) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeProConfirm(false);
    return;
  }
  if (e.key !== 'Tab') return;
  const picks = [$pcYes, $pcNo].filter(el => el && !el.disabled);
  if (picks.length < 2) return;
  const first = picks[0];
  const last = picks[picks.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else if (document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* BIO: Implementation note for this section. */
let trailEnabled     = false;
let gridTrailEnabled = false;

document.getElementById('tb-trail').addEventListener('click', function () {
  trailEnabled = !trailEnabled;
  this.classList.toggle('active', trailEnabled);
  this.setAttribute('aria-pressed', trailEnabled ? 'true' : 'false');
});
document.getElementById('tb-grid').addEventListener('click', function () {
  gridTrailEnabled = !gridTrailEnabled;
  this.classList.toggle('active', gridTrailEnabled);
  this.setAttribute('aria-pressed', gridTrailEnabled ? 'true' : 'false');
});

const $tbFs    = document.getElementById('tb-fs');
const $fsEnter = $tbFs.querySelector('.fs-enter');
const $fsExit  = $tbFs.querySelector('.fs-exit');

function isFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

$tbFs.addEventListener('click', () => {
  if (isFullscreen()) {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (exit) {
      const r = exit.call(document);
      if (r && typeof r.catch === 'function') r.catch(() => {});
    }
  } else {
    const req = document.documentElement.requestFullscreen
             || document.documentElement.webkitRequestFullscreen;
    if (req) {
      try {
        const r = req.call(document.documentElement);
        if (r && typeof r.catch === 'function') r.catch(() => {});
      } catch (_) { /* BIO: silent fail */ }
    }
  }
});

function syncFsButton() {
  const fs = isFullscreen();
  $tbFs.classList.toggle('active', fs);
  const u = UI[currentLang];
  $tbFs.title = fs ? u.fsExitAria : u.fsEnterAria;
  $fsEnter.style.display = fs ? 'none'  : '';
  $fsExit.style.display  = fs ? ''      : 'none';
  syncFsAriaLabelsDefault();
}
document.addEventListener('fullscreenchange', syncFsButton);
document.addEventListener('webkitfullscreenchange', syncFsButton);

/* BIO: Photo and gallery behavior note. */
const $photoViewer      = document.getElementById('photo-viewer');
const $photoViewerInner = document.getElementById('photo-viewer-inner');
const $photoViewerImg   = document.getElementById('photo-viewer-img');
const $photoViewerCap   = document.getElementById('photo-viewer-caption');
const $pvPrev           = document.getElementById('pv-prev');
const $pvNext           = document.getElementById('pv-next');
const $pvCounter        = document.getElementById('pv-counter');

let pvGallery  = [];
let pvIndex    = 0;
let pvNavigating = false;

function isAllowedGallerySrc(src) {
  return typeof src === 'string' && /^assets\/(?:default|pro)\//.test(src);
}

function normalizeGallery(rawGallery) {
  if (!Array.isArray(rawGallery)) return [];
  return rawGallery
    .filter(item => item && isAllowedGallerySrc(item.src))
    .map(item => ({
      src: item.src,
      cap: typeof item.cap === 'string' ? item.cap : ''
    }));
}

function updatePvNav() {
  const single = pvGallery.length <= 1;
  $pvPrev.classList.toggle('hidden', single || pvIndex === 0);
  $pvNext.classList.toggle('hidden', single || pvIndex === pvGallery.length - 1);
  $pvCounter.classList.toggle('hidden', single);
  if (!single) $pvCounter.textContent = (pvIndex + 1) + ' / ' + pvGallery.length;
}

function openPhotoViewer(gallery, startIndex) {
  if (typeof gallery === 'string') {
    pvGallery = [{ src: gallery, cap: startIndex || '' }];
    pvIndex = 0;
  } else {
    pvGallery = gallery;
    pvIndex = startIndex || 0;
  }
  const item = pvGallery[pvIndex];
  $photoViewerImg.src = item.src;
  $photoViewerCap.textContent = item.cap || '';
  updatePvNav();
  $photoViewer.classList.add('active');
  gsap.fromTo($photoViewerInner,
    { scale: 0.3, opacity: 0 },
    { scale: 1,   opacity: 1, duration: 0.35, ease: 'back.out(1.3)' }
  );
}

function navigateGallery(dir) {
  const next = pvIndex + dir;
  if (next < 0 || next >= pvGallery.length || pvNavigating) return;
  pvNavigating = true;
  const slideOut = dir > 0 ? -40 : 40;
  const slideIn  = dir > 0 ?  40 : -40;
  gsap.to($photoViewerImg, {
    x: slideOut, opacity: 0, duration: 0.18, ease: 'power2.in',
    onComplete: () => {
      pvIndex = next;
      const item = pvGallery[pvIndex];
      $photoViewerImg.src = item.src;
      $photoViewerCap.textContent = item.cap || '';
      updatePvNav();
      gsap.fromTo($photoViewerImg,
        { x: slideIn, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.22, ease: 'power2.out',
          onComplete: () => { pvNavigating = false; }
        }
      );
    }
  });
}

function closePhotoViewer() {
  gsap.to($photoViewerInner, {
    scale: 0.3, opacity: 0, duration: 0.25, ease: 'power2.in',
    onComplete: () => {
      $photoViewer.classList.remove('active');
      $photoViewerImg.src = '';
      pvGallery = [];
      pvIndex = 0;
      gsap.set($photoViewerInner, { clearProps: 'all' });
      gsap.set($photoViewerImg, { clearProps: 'all' });
    }
  });
}

const THROW_CONFIGS = {
  alien: {
    video: 'assets/default/interactions/alien-throw.mp4',
    charW: 500,
    /** BIO: Mobil dar geni鑹ikte video sa鑷?kenara yak璋媙s璋媙; varsay璋媗an 80px fazla i鑾絜ri 鑾絜kti鑷抜 i鑾絠n sola ka鑾借皨yordu. */
    charRightMobile: '6px',
    throwTime: 3.3,
    proj: 'assets/default/interactions/crumpledpaper.webp', projW: 75,
    projStartRight: '21vw', projStartTop: '18vh',
    sfx: {
      // BIO: UFO transition configuration note.
      enter:   { src: 'assets/default/sfx/alien-enter.mp3',  mix: 0.60, on: 'enter' },
      // BIO: Implementation note for this section.
      capsule: { src: 'assets/default/sfx/capsule-open.mp3', mix: 0.60, at: 1.2 },
      // BIO: Paper throw whoosh at throwTime.
      whoosh:  { src: 'assets/default/sfx/paper-whoosh.mp3', mix: 0.65, on: 'throw' },
      // BIO: Screen impact 600ms after the whoosh, aligned with the flash.
      hit:     { src: 'assets/default/sfx/paper-hit.mp3',    mix: 0.75, on: 'impact', delay: 600 },
      // BIO: UFO departure 0.8s before the video ends.
      depart:  { src: 'assets/default/sfx/ufo-depart.mp3',   mix: 0.70, beforeEnd: 0.8 }
    }
  },
  astronaut: {
    video: 'assets/default/interactions/astronaut-throw.mp4',
    charW: 300, throwTime: 6.7, charRight: '30px',
    proj: 'assets/default/interactions/joystick.webp', projW: 90,
    projStartRight: '10vw', projStartTop: '7.5vh',
    sfx: {
      // BIO: Implementation note for this section.
      enter:   { src: 'assets/default/sfx/astro-enter.mp3',   mix: 0.60, on: 'enter' },
      // BIO: Switch gameplay click around 1.2s into the video.
      click:   { src: 'assets/default/sfx/switch-click.mp3',  mix: 0.55, at: 1.2 },
      // BIO: Astronaut reaction around 4.8s into the video, mixed slightly quieter.
      shocked: { src: 'assets/default/sfx/astro-shocked.mp3', mix: 0.40, at: 4.8 },
      // BIO: Joystick throw whoosh at throwTime.
      whoosh:  { src: 'assets/default/sfx/throw-whoosh.mp3',  mix: 0.70, on: 'throw' },
      // BIO: Screen crack 0.6s after the whoosh, aligned with the flash burst.
      crack:   { src: 'assets/default/sfx/screen-crack.mp3',  mix: 0.85, on: 'impact', delay: 600 }
    }
  }
};

function playAlienThrow(gallery, configKey) {
  const cfg = THROW_CONFIGS[configKey] || THROW_CONFIGS.alien;
  const isVideo = !!cfg.video;

  if (killPlane) killPlane();

  const blocker = document.createElement('div');
  Object.assign(blocker.style, {
    position: 'fixed', inset: '0', zIndex: '8998',
    background: 'transparent', cursor: 'none'
  });
  document.body.appendChild(blocker);

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = vw / 2;
  const cy = vh / 2;

  /* BIO: Implementation note for this section. */
  let alien;
  if (isVideo) {
    const alienW = cfg.charW || 400;
    alien = document.createElement('video');
    alien.src = cfg.video;
    alien.muted = true;
    alien.playsInline = true;
    alien.preload = 'auto';
    Object.assign(alien.style, {
      position: 'fixed', zIndex: '9000',
      width: alienW + 'px', height: 'auto',
      right: -(alienW + 20) + 'px', top: cfg.charTop || '8vh',
      pointerEvents: 'none',
      mixBlendMode: 'screen'
    });
  } else {
    const alienW = cfg.charW || 400;
    alien = document.createElement('img');
    alien.src = cfg.char;
    Object.assign(alien.style, {
      position: 'fixed', zIndex: '9000',
      width: alienW + 'px', height: 'auto',
      right: -(alienW + 20) + 'px', top: cfg.charTop,
      pointerEvents: 'none'
    });
  }

  /* BIO: Pro Mode integration note. */
  const paper = document.createElement('img');
  paper.src = cfg.proj;
  if (isVideo) {
    Object.assign(paper.style, {
      position: 'fixed', zIndex: '9001',
      width: cfg.projW + 'px', height: 'auto',
      right: cfg.projStartRight, top: cfg.projStartTop,
      pointerEvents: 'none', opacity: '0',
      transformOrigin: 'center center'
    });
  } else {
    Object.assign(paper.style, {
      position: 'fixed', zIndex: '9001',
      width: cfg.projW + 'px', height: 'auto',
      right: cfg.projRightOffset + 'px',
      top: `calc(${cfg.charTop} + ${cfg.projTopOffset}px)`,
      pointerEvents: 'none', opacity: '0',
      transformOrigin: 'center center'
    });
  }

  /* BIO: Implementation note for this section. */
  const flash = document.createElement('div');
  Object.assign(flash.style, {
    position: 'fixed', inset: '0', zIndex: '8999',
    background: 'rgba(0,255,136,0.2)', pointerEvents: 'none', opacity: '0'
  });

  /* BIO: Implementation note for this section. */
  const unfoldWrap = document.createElement('div');
  Object.assign(unfoldWrap.style, {
    position: 'fixed', zIndex: '9002',
    left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
    pointerEvents: 'none', opacity: '0'
  });
  const photoImg = document.createElement('img');
  photoImg.src = gallery[0].src;
  Object.assign(photoImg.style, {
    display: 'block', maxWidth: '460px', width: '85vw',
    clipPath: 'inset(45% 45% 45% 45%)', filter: 'brightness(1.05)'
  });
  unfoldWrap.appendChild(photoImg);

  document.body.appendChild(alien);
  document.body.appendChild(paper);
  document.body.appendChild(flash);
  document.body.appendChild(unfoldWrap);

  const skipBtn = document.createElement('button');
  skipBtn.className = 'anim-skip';
  skipBtn.textContent = UI[currentLang].skip;
  skipBtn.style.zIndex = '9003';
  document.body.appendChild(skipBtn);
  gsap.to(skipBtn, { opacity: 1, duration: 0.4, delay: 0.3 });

  /* BIO: Audio, SFX, and mini-player behavior note. */
  const sfx = {};
  const sfxTimers = [];
  if (cfg.sfx) {
    for (const [key, s] of Object.entries(cfg.sfx)) {
      const a = new Audio(s.src);
      a.preload = 'auto';
      a.volume  = Math.min(1, s.mix * globalVolume);
      sfx[key] = { audio: a, mix: s.mix, cfg: s };
    }
  }
  function playSfx(key) {
    const s = sfx[key];
    if (!s) return;
    s.audio.volume = Math.min(1, s.mix * globalVolume);
    try { s.audio.currentTime = 0; } catch (_) {}
    const p = s.audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }
  function stopAllSfx() {
    for (const key in sfx) {
      const a = sfx[key].audio;
      gsap.killTweensOf(a);
      try { a.pause(); a.currentTime = 0; } catch (_) {}
    }
    while (sfxTimers.length) clearTimeout(sfxTimers.pop());
  }

  let cleaned = false;
  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    stopAllSfx();
    alien.remove();
    paper.remove();
    flash.remove();
    unfoldWrap.remove();
    blocker.remove();
    skipBtn.remove();
    alienAnimPlaying = false;
    openPhotoViewer(gallery, 0);
  }

  skipBtn.addEventListener('click', () => {
    gsap.killTweensOf([alien, paper, flash, unfoldWrap, photoImg, document.body, skipBtn]);
    gsap.set(document.body, { x: 0, clearProps: 'transform' });
    if (isVideo) { try { alien.pause(); } catch (_) {} }
    cleanup();
  });

  if (isVideo) {
    /* BIO: Implementation note for this section. */
    const throwTime = cfg.throwTime || 3.8;
    let paperLaunched = false;

    const paperTl = gsap.timeline({ paused: true });

    paperTl.set(paper, { opacity: 1 });
    paperTl.to(paper, {
      left: (cx - 20) + 'px', top: (cy - 24) + 'px', right: 'auto',
      rotation: 720, scale: 12,
      duration: 0.6, ease: 'power2.in'
    });
    paperTl.to(flash, { opacity: 1, duration: 0.06 });
    paperTl.to(document.body, { x: 4, yoyo: true, repeat: 3, duration: 0.04, ease: 'sine.inOut' });
    paperTl.to(flash, { opacity: 0, duration: 0.25 });
    paperTl.set(document.body, { x: 0 });
    paperTl.to(paper, {
      scale: 7, rotation: 0,
      filter: 'brightness(1.3) blur(2px)',
      duration: 0.4, ease: 'power1.out'
    });
    paperTl.to(paper, {
      opacity: 0, filter: 'brightness(2) blur(8px)',
      duration: 0.3, ease: 'power1.in'
    });
    paperTl.set(unfoldWrap, { opacity: 1 }, '-=0.25');
    paperTl.fromTo(photoImg,
      { clipPath: 'inset(42% 42% 42% 42%)', scale: 0.4, filter: 'brightness(1.6) saturate(0.3)' },
      { clipPath: 'inset(0% 0% 0% 0%)',     scale: 1,   filter: 'brightness(1.05) saturate(1)',
        duration: 0.6, ease: 'power2.out' },
      '-=0.25'
    );
    paperTl.to({}, { duration: 0.3, onComplete: cleanup });

    const sfxTriggered = {};
    alien.addEventListener('timeupdate', () => {
      if (cfg.sfx) {
        for (const [key, s] of Object.entries(cfg.sfx)) {
          if (sfxTriggered[key]) continue;
          if (s.at != null && alien.currentTime >= s.at) {
            sfxTriggered[key] = true;
            playSfx(key);
          } else if (s.beforeEnd != null && alien.duration &&
                     alien.currentTime >= alien.duration - s.beforeEnd) {
            sfxTriggered[key] = true;
            playSfx(key);
          }
        }
      }
      if (!paperLaunched && alien.currentTime >= throwTime) {
        paperLaunched = true;
        if (cfg.sfx) {
          for (const [key, s] of Object.entries(cfg.sfx)) {
            if (s.on === 'throw') playSfx(key);
            else if (s.on === 'impact') {
              const d = s.delay != null ? s.delay : 600;
              const k = key;
              sfxTimers.push(setTimeout(() => playSfx(k), d));
            }
          }
        }
        paperTl.play();
      }
    });

    alien.addEventListener('ended', () => {
      if (!cleaned && cfg.sfx) {
        for (const [key, s] of Object.entries(cfg.sfx)) {
          if (s.on === 'exit') playSfx(key);
        }
      }
      if (!paperLaunched) {
        gsap.to(alien, {
          right: -(cfg.charW + 20) + 'px', duration: 0.5, ease: 'power2.in',
          onComplete: cleanup
        });
      } else {
        gsap.to(alien, {
          right: -(cfg.charW + 20) + 'px', duration: 0.5, ease: 'power2.in',
          onComplete: () => alien.remove()
        });
      }
    });

    const targetRight =
      IS_MOBILE && cfg.charRightMobile !== undefined && cfg.charRightMobile !== ''
        ? cfg.charRightMobile
        : cfg.charRight || '80px';
    gsap.to(alien, {
      right: targetRight, duration: 0.6, ease: 'power2.out',
      onStart: () => { alien.play(); playSfx('enter'); }
    });

  } else {
    /* BIO: Implementation note for this section. */
    const tl = gsap.timeline();

    tl.to(alien, { right: '40px', duration: 0.5, ease: 'power2.out' });
    tl.to(alien, { y: -8, yoyo: true, repeat: 2, duration: 0.15, ease: 'sine.inOut' });

    tl.set(paper, { opacity: 1 });
    tl.to(paper, {
      left: (cx - 20) + 'px', top: (cy - 24) + 'px', right: 'auto',
      rotation: 720, scale: 5,
      duration: 0.6, ease: 'power2.in'
    });

    tl.to(flash, { opacity: 1, duration: 0.06 });
    tl.to(document.body, { x: 4, yoyo: true, repeat: 3, duration: 0.04, ease: 'sine.inOut' });
    tl.to(flash, { opacity: 0, duration: 0.25 });
    tl.set(document.body, { x: 0 });

    tl.to(alien, { right: '-200px', duration: 0.3, ease: 'power2.in' }, '-=0.3');

    tl.to(paper, {
      scale: 7, rotation: 0,
      filter: 'brightness(1.3) blur(2px)',
      duration: 0.4, ease: 'power1.out'
    });
    tl.to(paper, {
      opacity: 0, filter: 'brightness(2) blur(8px)',
      duration: 0.3, ease: 'power1.in'
    });

    tl.set(unfoldWrap, { opacity: 1 }, '-=0.25');
    tl.fromTo(photoImg,
      { clipPath: 'inset(42% 42% 42% 42%)', scale: 0.4, filter: 'brightness(1.6) saturate(0.3)' },
      { clipPath: 'inset(0% 0% 0% 0%)',     scale: 1,   filter: 'brightness(1.05) saturate(1)',
        duration: 0.6, ease: 'power2.out' },
      '-=0.25'
    );

    tl.to({}, { duration: 0.3, onComplete: cleanup });
  }
}

// BIO: 閳光偓閳光偓 Click handler for .photo-link 閳光偓閳光偓
let alienAnimPlaying = false;

document.addEventListener('click', e => {
  const link = e.target.closest('.photo-link');
  if (link) {
    e.preventDefault();
    if (alienAnimPlaying) return;
    let gallery;
    if (link.dataset.gallery) {
      try {
        gallery = normalizeGallery(JSON.parse(link.dataset.gallery));
      } catch (_) {
        gallery = [];
      }
    } else {
      gallery = normalizeGallery([{ src: link.dataset.photo, cap: link.dataset.caption || '' }]);
    }
    if (!gallery.length) return;
    alienAnimPlaying = true;
    playAlienThrow(gallery, link.dataset.anim);
    return;
  }
});

// BIO: 閳光偓閳光偓 Gallery nav buttons 閳光偓閳光偓
$pvPrev.addEventListener('click', e => { e.stopPropagation(); navigateGallery(-1); });
$pvNext.addEventListener('click', e => { e.stopPropagation(); navigateGallery(1); });

// BIO: 閳光偓閳光偓 Close photo viewer 閳光偓閳光偓
document.getElementById('photo-viewer-close').addEventListener('click', closePhotoViewer);

$photoViewer.addEventListener('click', e => {
  if (e.target.closest('.pv-nav')) return;
  if (!e.target.closest('#photo-viewer-inner') || e.target === $photoViewerImg) {
    closePhotoViewer();
  }
});

// BIO: 閳光偓閳光偓 Keyboard navigation 閳光偓閳光偓
document.addEventListener('keydown', e => {
  if (!$photoViewer.classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  { e.preventDefault(); navigateGallery(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); navigateGallery(1); }
  if (e.key === 'Escape')     { e.preventDefault(); closePhotoViewer(); }
});


/* BIO: UFO transition configuration note. */
const UFO_CFG = {
  video: 'assets/default/interactions/ufo-intro.mp4',
  photo: 'assets/default/common/bilal2.webp',
  ufoW: 420,
  photoW: 120,
  photoH: 160,
  beamTime: 2.5,
  closeTime: 4.5,
  closeSoundTime: 4.2,
  sfx: {
    hover: { src: 'assets/default/sfx/ufo-hover.mp3', mix: 0.55, loop: false },
    beam:  { src: 'assets/default/sfx/ufo-beam.mp3',  mix: 0.75, loop: false },
    close: { src: 'assets/default/sfx/ufo-close.mp3', mix: 0.80, loop: false },
    fly:   { src: 'assets/default/sfx/ufo-fly.mp3',   mix: 0.70, loop: false }
  }
};

function playUfoIntro() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const blocker = document.createElement('div');
  Object.assign(blocker.style, {
    position: 'fixed', inset: '0', zIndex: '5998',
    background: 'transparent'
  });
  document.body.appendChild(blocker);

  const skipBtn = document.createElement('button');
  skipBtn.className = 'anim-skip';
  skipBtn.textContent = UI[currentLang].skip;
  skipBtn.style.zIndex = '6001';
  document.body.appendChild(skipBtn);
  gsap.to(skipBtn, { opacity: 1, duration: 0.4, delay: 0.6 });

  /* BIO: UFO transition configuration note. */
  const sfx = {};
  for (const [key, cfg] of Object.entries(UFO_CFG.sfx)) {
    const a = new Audio(cfg.src);
    a.preload = 'auto';
    a.loop    = cfg.loop;
    a.volume  = Math.min(1, cfg.mix * globalVolume);
    sfx[key] = { audio: a, mix: cfg.mix };
  }
  function playSfx(key) {
    const s = sfx[key];
    if (!s) return;
    s.audio.volume = Math.min(1, s.mix * globalVolume);
    try { s.audio.currentTime = 0; } catch (_) {}
    const p = s.audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }
  function fadeSfxOut(key, duration) {
    const s = sfx[key];
    if (!s) return;
    gsap.to(s.audio, {
      volume: 0, duration, ease: 'power2.in',
      onComplete: () => { try { s.audio.pause(); s.audio.currentTime = 0; } catch (_) {} }
    });
  }
  function stopAllSfx() {
    for (const key in sfx) {
      const a = sfx[key].audio;
      gsap.killTweensOf(a);
      try { a.pause(); a.currentTime = 0; } catch (_) {}
    }
  }

  const ufo = document.createElement('video');
  ufo.src = UFO_CFG.video;
  ufo.muted = true;
  ufo.playsInline = true;
  ufo.preload = 'auto';
  Object.assign(ufo.style, {
    position: 'fixed', zIndex: '6000',
    width: UFO_CFG.ufoW + 'px', height: 'auto',
    left: '50%', top: -(UFO_CFG.ufoW) + 'px',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
    mixBlendMode: 'screen'
  });

  const photo = document.createElement('img');
  photo.src = UFO_CFG.photo;
  Object.assign(photo.style, {
    position: 'fixed', zIndex: '5999',
    width: UFO_CFG.photoW + 'px', height: UFO_CFG.photoH + 'px',
    objectFit: 'cover',
    borderRadius: '8px',
    left: '50%', top: '15%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
    opacity: '0',
    boxShadow: '0 0 20px rgba(0,229,255,0.4), 0 0 60px rgba(0,229,255,0.15)'
  });

  document.body.appendChild(ufo);
  document.body.appendChild(photo);

  let photoDropped = false;
  let beamClosed = false;
  let closeSoundPlayed = false;

  const centerY = vh / 2;
  const photoTargetY = centerY - UFO_CFG.photoH + 20;

  ufo.addEventListener('timeupdate', () => {
    if (!photoDropped && ufo.currentTime >= UFO_CFG.beamTime) {
      photoDropped = true;
      playSfx('beam');
      gsap.to(photo, {
        opacity: 1, top: photoTargetY + 'px',
        duration: 1.4, ease: 'power1.out'
      });
    }
    if (!closeSoundPlayed && ufo.currentTime >= UFO_CFG.closeSoundTime) {
      closeSoundPlayed = true;
      playSfx('close');
    }
    if (!beamClosed && ufo.currentTime >= UFO_CFG.closeTime) {
      beamClosed = true;
      gsap.to(photo, {
        boxShadow: '0 0 30px rgba(0,229,255,0.6), 0 0 80px rgba(0,229,255,0.2)',
        duration: 0.3
      });
    }
  });

  ufo.addEventListener('ended', () => {
    fadeSfxOut('hover', 0.6);
    playSfx('fly');
    gsap.to(ufo, {
      top: -(UFO_CFG.ufoW + 20) + 'px',
      duration: 0.8, ease: 'power2.in',
      onComplete: () => { ufo.remove(); blocker.remove(); }
    });
    ufoPhotoRevealed = true;
    const svgAvatar = document.querySelector('.center-avatar');
    if (svgAvatar) svgAvatar.style.opacity = '1';
    photo.remove();
    skipBtn.remove();
  });

  skipBtn.addEventListener('click', () => {
    gsap.killTweensOf([ufo, photo, skipBtn]);
    stopAllSfx();
    try { ufo.pause(); } catch (_) {}
    ufo.remove();
    photo.remove();
    blocker.remove();
    skipBtn.remove();
    ufoPhotoRevealed = true;
    const svgAvatar = document.querySelector('.center-avatar');
    if (svgAvatar) svgAvatar.style.opacity = '1';
  });

  gsap.to(ufo, {
    top: '12%', duration: 1.0, ease: 'power2.out', delay: 0.3,
    onStart: () => { ufo.play(); playSfx('hover'); }
  });
}

/* BIO: Implementation note for this section. */
let planeFlying = false;
let killPlane   = null;

/** Mobil Default Mode 閳?a鑷抋鑾?haz璋媟ken yatayda dikey kullan璋媘 鏋歯erisi (#bgs-default-landscape-hint). */
function syncDefaultLandscapeHint() {
  const el = document.getElementById('bgs-default-landscape-hint');
  if (!el || !IS_MOBILE) return;
  if (!siteReady) {
    el.hidden = true;
    return;
  }
  let ls = false;
  try {
    ls =
      (typeof matchMedia !== 'undefined' && matchMedia('(orientation: landscape)').matches) ||
      window.innerWidth > window.innerHeight + 28;
  } catch (_err) {
    ls = window.innerWidth > window.innerHeight + 28;
  }
  if (!ls) {
    el.hidden = true;
    return;
  }
  const dict = UI[currentLang] || UI.en;
  el.textContent = dict.defaultLandscapeHint || UI.en.defaultLandscapeHint;
  el.hidden = false;
}

if (IS_MOBILE && typeof window !== 'undefined') {
  window.addEventListener(
    'orientationchange',
    () => window.requestAnimationFrame(syncDefaultLandscapeHint),
    false
  );
  window.addEventListener('resize', syncDefaultLandscapeHint, false);
}

function flyPlane() {
  if (planeFlying || !siteReady) return;
  // BIO: Suppress plane flybys while Pro Mode confirmation / transition is active
  if ($pcWrap && $pcWrap.classList.contains('open')) return;
  if (typeof proEscapeRunning !== 'undefined' && proEscapeRunning) return;
  if (typeof proModeConfirmed !== 'undefined' && proModeConfirmed) return;
  planeFlying = true;

  let paused = false;
  let autoRemoveTimer = null;

  const planeWrap = document.createElement('div');
  Object.assign(planeWrap.style, {
    position: 'fixed', zIndex: '6000',
    right: '-500px', top: (8 + Math.random() * 25) + 'vh',
    pointerEvents: 'none'
  });

  const plane = document.createElement('img');
  plane.src = 'assets/default/interactions/plane1.webp';
  Object.assign(plane.style, {
    height: '450px', width: 'auto', display: 'block', pointerEvents: 'none'
  });

  const hitbox = document.createElement('div');
  Object.assign(hitbox.style, {
    position: 'absolute', top: '30%', left: '20%',
    width: '60%', height: '25%',
    cursor: 'none', pointerEvents: 'auto'
  });

  planeWrap.appendChild(plane);
  planeWrap.appendChild(hitbox);

  hitbox.addEventListener('click', () => {
    if (!paused) {
      tween.pause();
      paused = true;
      autoRemoveTimer = setTimeout(() => {
        gsap.to(planeWrap, { opacity: 0, duration: 0.5, onComplete: cleanup });
      }, 10000);
    } else {
      paused = false;
      if (autoRemoveTimer) { clearTimeout(autoRemoveTimer); autoRemoveTimer = null; }
      tween.resume();
    }
  });

  function cleanup() {
    if (autoRemoveTimer) { clearTimeout(autoRemoveTimer); autoRemoveTimer = null; }
    gsap.killTweensOf(planeWrap);
    planeWrap.remove();
    planeFlying = false;
    killPlane = null;
  }

  killPlane = cleanup;
  document.body.appendChild(planeWrap);

  const tween = gsap.to(planeWrap, {
    right: (window.innerWidth + 500) + 'px',
    duration: 10, ease: 'none',
    onComplete: cleanup
  });
}

function schedulePlane() {
  const delay = 90000 + Math.random() * 15000;
  setTimeout(() => {
    flyPlane();
    schedulePlane();
  }, delay);
}
schedulePlane();

/* BIO: Implementation note for this section. */
document.getElementById('status-left').textContent = 'ZTS | PORTFOLIO';
updateStatusDate();

(function startIntro() {
  const $splash      = document.getElementById('splash');
  const $splashStart  = document.getElementById('splash-start');
  const $volBlocks    = document.getElementById('splash-vol-blocks');
  const $splashPct    = document.getElementById('splash-vol-pct');
  const $splashIcon   = document.getElementById('splash-vol-icon');
  const $introVideo   = document.getElementById('intro-video');
  const $introVid     = document.getElementById('intro-vid');
  const $introSkip    = document.getElementById('intro-skip');
  const $introSound   = document.getElementById('intro-sound');
  const $soundIcon    = document.getElementById('intro-sound-icon');
  const $soundLabel   = document.getElementById('intro-sound-label');

  const $mainVol       = document.getElementById('main-vol');
  const $mainVolBlocks = document.getElementById('main-vol-blocks');
  const $mainVolPct    = document.getElementById('main-vol-pct');
  const $mainVolIcon   = document.getElementById('main-vol-icon');

  const SPLASH_BLOCKS = 20;
  const MAIN_BLOCKS   = 16;
  let videoEnded      = false;
  let draggingSplash  = false;
  let draggingMain    = false;
  let draggingViz     = false;
  let vizDragStartY   = 0;
  let vizDragStartVol = 0;
  let musicAudio      = null;

  function buildBlocks(container, count, maxH) {
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'vb';
      b.style.height = (4 + (i / (count - 1)) * maxH) + 'px';
      container.appendChild(b);
    }
    return [...container.querySelectorAll('.vb')];
  }

  const splashBlocks = buildBlocks($volBlocks, SPLASH_BLOCKS, 22);
  const mainBlocks   = buildBlocks($mainVolBlocks, MAIN_BLOCKS, 12);

  function mountVolBlocksRange(blocksEl, rangeId) {
    if (!blocksEl || blocksEl.closest('.bgs-vol-blocks-wrap')) return null;
    const wrap = document.createElement('div');
    wrap.className = 'bgs-vol-blocks-wrap';
    blocksEl.parentNode.insertBefore(wrap, blocksEl);
    wrap.appendChild(blocksEl);
    const r = document.createElement('input');
    r.type = 'range';
    r.id = rangeId;
    r.className = 'bgs-vol-range';
    r.min = '0';
    r.max = '100';
    r.step = '1';
    r.setAttribute('aria-label', 'Master volume');
    wrap.appendChild(r);
    return r;
  }

  const splashVolRange = mountVolBlocksRange($volBlocks, 'splash-vol-range');
  const mainVolRange = mountVolBlocksRange($mainVolBlocks, 'main-vol-range');

  const volLiveEl = document.getElementById('bgs-a11y-vol-live');
  let volLiveTimer = null;
  function announceVolumeLive() {
    if (!volLiveEl) return;
    if (volLiveTimer) clearTimeout(volLiveTimer);
    volLiveTimer = setTimeout(() => {
      volLiveTimer = null;
      volLiveEl.textContent = Math.round(globalVolume * 100) + '%';
    }, 420);
  }

  if (splashVolRange) {
    splashVolRange.addEventListener('input', () => {
      setVolume(parseInt(splashVolRange.value, 10) / 100);
    });
  }
  if (mainVolRange) {
    mainVolRange.addEventListener('input', () => {
      setVolume(parseInt(mainVolRange.value, 10) / 100);
    });
  }

  function updateBlocks(blockArr, count) {
    const active = Math.round(globalVolume * count);
    blockArr.forEach((b, i) => {
      const on = i < active;
      b.classList.toggle('active', on);
      b.classList.toggle('hot', on && i >= count * 0.85);
    });
  }

  function setVolume(level) {
    globalVolume = Math.max(0, Math.min(1, level));
    persistVolumeToStorage(globalVolume);
    updateBlocks(splashBlocks, SPLASH_BLOCKS);
    updateBlocks(mainBlocks, MAIN_BLOCKS);
    const pct = Math.round(globalVolume * 100) + '%';
    const icon = globalVolume === 0 ? '棣冩敧' : '棣冩敯';
    $splashPct.textContent = pct;
    $splashIcon.textContent = icon;
    $mainVolPct.textContent = pct;
    $mainVolIcon.textContent = icon;
    if (splashVolRange) {
      splashVolRange.value = String(Math.round(globalVolume * 100));
      splashVolRange.setAttribute('aria-valuetext', pct);
    }
    if (mainVolRange) {
      mainVolRange.value = String(Math.round(globalVolume * 100));
      mainVolRange.setAttribute('aria-valuetext', pct);
    }
    announceVolumeLive();
    if (testAudio && !testAudio.paused) testAudio.volume = globalVolume;
    if (musicAudio) musicAudio.volume = globalVolume;
    applyProTransitionSfxVolume();
  }

  const $volTest = document.getElementById('splash-vol-test');
  const testAudio = new Audio();
  testAudio.crossOrigin = 'anonymous';
  testAudio.src = 'assets/default/music/track1.ogg';

  /* BIO: Audio, SFX, and mini-player behavior note. */
  const $audioViz    = document.getElementById('audio-viz');
  const $vizHit      = document.getElementById('viz-hit');
  const vizCtx       = $audioViz.getContext('2d');
  let   audioCtx     = null;
  let   analyser     = null;
  let   vizSource    = null;
  let   vizAnimId    = null;
  let   vizDataArray = null;

  function resizeViz() { $audioViz.width = innerWidth; $audioViz.height = innerHeight; }
  resizeViz();
  window.addEventListener('resize', resizeViz);

  function initAudioCtx() {
    if (vizSource) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.6;
      vizSource = audioCtx.createMediaElementSource(testAudio);
      vizSource.connect(analyser);
      analyser.connect(audioCtx.destination);
      vizDataArray = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) {
      audioCtx = analyser = vizSource = null;
    }
  }

  const WAVE_SAMPLES = 64;
  const waveBuffer = new Array(WAVE_SAMPLES).fill(0);
  let wavePhase = 0;

  function drawViz() {
    vizAnimId = requestAnimationFrame(drawViz);

    const w  = $audioViz.width;
    const h  = $audioViz.height;
    const cy = h / 2;
    vizCtx.clearRect(0, 0, w, h);

    let avgSignal = 0;
    if (analyser) {
      analyser.getByteFrequencyData(vizDataArray);
      const bufLen = analyser.frequencyBinCount;
      const usableLen = Math.floor(bufLen * 0.6);
      for (let i = 0; i < WAVE_SAMPLES; i++) {
        const srcIdx = Math.floor((i / WAVE_SAMPLES) * usableLen);
        const boost  = i < 6 ? 1.15 : i < 20 ? 1.05 : i < 40 ? 1.0 : 0.85;
        const target = Math.min(255, vizDataArray[srcIdx] * boost) / 255;
        waveBuffer[i] = waveBuffer[i] * 0.72 + target * 0.28;
        avgSignal += waveBuffer[i];
      }
      avgSignal /= WAVE_SAMPLES;
    } else {
      for (let i = 0; i < WAVE_SAMPLES; i++) waveBuffer[i] *= 0.85;
    }

    wavePhase += 0.015 + avgSignal * 0.05;

    const totalW  = w * 0.7;
    const startX  = (w - totalW) / 2;
    const maxAmp  = h * 0.20;
    const volScale = globalVolume;

    const TEAL   = 172;
    const PURPLE = 288;
    const WAVES = [
      { hue: TEAL,   phase: 0.0,  speed: 1.00, amp: 1.00, line: 1.6, alpha: 0.95, blur: 16 },
      { hue: TEAL,   phase: 1.2,  speed: 0.82, amp: 0.85, line: 1.3, alpha: 0.70, blur: 12 },
      { hue: TEAL,   phase: 2.4,  speed: 1.18, amp: 0.70, line: 1.1, alpha: 0.50, blur: 10 },
      { hue: PURPLE, phase: 0.6,  speed: 0.92, amp: 0.95, line: 1.5, alpha: 0.90, blur: 16 },
      { hue: PURPLE, phase: 1.8,  speed: 1.10, amp: 0.78, line: 1.2, alpha: 0.65, blur: 12 },
      { hue: PURPLE, phase: 3.0,  speed: 0.74, amp: 0.62, line: 1.0, alpha: 0.45, blur: 10 }
    ];

    for (const wave of WAVES) {
      vizCtx.save();
      vizCtx.lineCap  = 'round';
      vizCtx.lineJoin = 'round';
      vizCtx.lineWidth = wave.line;
      vizCtx.shadowBlur  = wave.blur;
      vizCtx.shadowColor = `hsla(${wave.hue}, 100%, 65%, ${(wave.alpha * 0.6).toFixed(2)})`;

      const grad = vizCtx.createLinearGradient(startX, cy, startX + totalW, cy);
      grad.addColorStop(0,    `hsla(${wave.hue}, 100%, 65%, 0)`);
      grad.addColorStop(0.18, `hsla(${wave.hue}, 100%, 72%, ${(wave.alpha * 0.9).toFixed(2)})`);
      grad.addColorStop(0.5,  `hsla(${wave.hue + 8}, 100%, 78%, ${wave.alpha.toFixed(2)})`);
      grad.addColorStop(0.82, `hsla(${wave.hue}, 100%, 72%, ${(wave.alpha * 0.9).toFixed(2)})`);
      grad.addColorStop(1,    `hsla(${wave.hue}, 100%, 65%, 0)`);
      vizCtx.strokeStyle = grad;

      const pts = new Array(WAVE_SAMPLES);
      for (let i = 0; i < WAVE_SAMPLES; i++) {
        const t        = i / (WAVE_SAMPLES - 1);
        const x        = startX + t * totalW;
        const envelope = Math.sin(t * Math.PI);
        const freq     = waveBuffer[i];
        const osc      = Math.sin(t * Math.PI * 4 + wavePhase * wave.speed + wave.phase);
        const baseAmp  = maxAmp * volScale * wave.amp;
        const texture  = 1 + freq * 0.55;
        const amp      = baseAmp * texture * envelope;
        const y        = cy + osc * amp;
        pts[i] = { x, y };
      }

      vizCtx.beginPath();
      vizCtx.moveTo(pts[0].x, pts[0].y);
      for (let i = 0; i < WAVE_SAMPLES - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const mx = (p0.x + p1.x) / 2;
        const my = (p0.y + p1.y) / 2;
        vizCtx.quadraticCurveTo(p0.x, p0.y, mx, my);
      }
      vizCtx.lineTo(pts[WAVE_SAMPLES - 1].x, pts[WAVE_SAMPLES - 1].y);
      vizCtx.stroke();

      vizCtx.restore();
    }
  }

  const $splashTitle = document.getElementById('splash-title');

  function startViz() {
    try {
      initAudioCtx();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { /* BIO: visualization unavailable */ }
    $audioViz.classList.add('active');
    $vizHit.classList.add('active');
    if (!vizAnimId) drawViz();
    $splashTitle.classList.add('viz-active');
  }

  function stopViz() {
    $audioViz.classList.remove('active');
    $vizHit.classList.remove('active');
    $splashTitle.classList.remove('viz-active');
    draggingViz = false;
    setTimeout(() => {
      if ($audioViz.classList.contains('active')) return;
      if (vizAnimId) { cancelAnimationFrame(vizAnimId); vizAnimId = null; }
      vizCtx.clearRect(0, 0, $audioViz.width, $audioViz.height);
      for (let i = 0; i < waveBuffer.length; i++) waveBuffer[i] = 0;
    }, 650);
  }

  setVolume(globalVolume);
  let savedVolume = globalVolume;
  function toggleMute() {
    if (globalVolume > 0) {
      savedVolume = globalVolume;
      setVolume(0);
    } else {
      setVolume(savedVolume || 0.7);
    }
  }
  $splashIcon.addEventListener('click', toggleMute);
  $mainVolIcon.addEventListener('click', toggleMute);
  let fadeTween = null;
  const FADE_IN  = 0.8;
  const FADE_OUT = 0.5;
  const fadeProxy = { v: 0 };

  $volTest.addEventListener('click', () => {
    if (!testAudio.paused) {
      $volTest.classList.remove('playing');
      $volTest.textContent = '閳?TEST VOLUME';
      if (fadeTween) { fadeTween.kill(); fadeTween = null; }
      fadeProxy.v = testAudio.volume;
      fadeTween = gsap.to(fadeProxy, {
        v: 0, duration: FADE_OUT, ease: 'power2.in',
        onUpdate: () => { testAudio.volume = fadeProxy.v; },
        onComplete: () => {
          testAudio.pause();
          testAudio.currentTime = 0;
          fadeTween = null;
        }
      });
      stopViz();
      return;
    }
    startViz();
    if (fadeTween) { fadeTween.kill(); fadeTween = null; }
    testAudio.volume = 0;
    fadeProxy.v = 0;
    testAudio.play();
    fadeTween = gsap.to(fadeProxy, {
      v: globalVolume, duration: FADE_IN, ease: 'power2.out',
      onUpdate: () => { testAudio.volume = fadeProxy.v; },
      onComplete: () => { fadeTween = null; }
    });
    $volTest.classList.add('playing');
    $volTest.textContent = '閳?STOP';
  });
  testAudio.addEventListener('ended', () => {
    $volTest.classList.remove('playing');
    $volTest.textContent = '閳?TEST VOLUME';
    if (fadeTween) { fadeTween.kill(); fadeTween = null; }
    stopViz();
  });

  function volFromBlocks(e, container) {
    const rect = container.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    setVolume(x / rect.width);
  }

  $volBlocks.addEventListener('mousedown', e => { draggingSplash = true; volFromBlocks(e, $volBlocks); });
  $mainVolBlocks.addEventListener('mousedown', e => { draggingMain = true; volFromBlocks(e, $mainVolBlocks); });
  window.addEventListener('mousemove', e => {
    if (draggingSplash) volFromBlocks(e, $volBlocks);
    if (draggingMain) volFromBlocks(e, $mainVolBlocks);
  });
  window.addEventListener('mouseup', () => { draggingSplash = false; draggingMain = false; });
  $volBlocks.addEventListener('touchstart', e => { draggingSplash = true; volFromBlocks(e, $volBlocks); }, { passive: true });
  $mainVolBlocks.addEventListener('touchstart', e => { draggingMain = true; volFromBlocks(e, $mainVolBlocks); }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (draggingSplash) volFromBlocks(e, $volBlocks);
    if (draggingMain) volFromBlocks(e, $mainVolBlocks);
  }, { passive: true });
  window.addEventListener('touchend', () => { draggingSplash = false; draggingMain = false; });

  /* BIO: Implementation note for this section. */
  function startVizDrag(clientY) {
    if (!$vizHit.classList.contains('active')) return;
    draggingViz     = true;
    vizDragStartY   = clientY;
    vizDragStartVol = globalVolume;
  }

  function moveVizDrag(clientY) {
    if (!draggingViz) return;
    const delta  = vizDragStartY - clientY;
    const range  = window.innerHeight * 0.5;
    const newVol = vizDragStartVol + delta / range;
    setVolume(newVol);
    if (testAudio && !testAudio.paused && fadeTween === null) {
      testAudio.volume = globalVolume;
    }
  }

  $vizHit.addEventListener('mousedown', e => { e.preventDefault(); startVizDrag(e.clientY); });
  $vizHit.addEventListener('touchstart', e => {
    if (e.touches && e.touches.length) startVizDrag(e.touches[0].clientY);
  }, { passive: true });

  window.addEventListener('mousemove', e => { moveVizDrag(e.clientY); });
  window.addEventListener('touchmove', e => {
    if (draggingViz && e.touches && e.touches.length) moveVizDrag(e.touches[0].clientY);
  }, { passive: true });

  window.addEventListener('mouseup', () => { draggingViz = false; });
  window.addEventListener('touchend', () => { draggingViz = false; });

  /* BIO: Audio, SFX, and mini-player behavior note. */
  const returningFromPro = (() => {
    try {
      const v = sessionStorage.getItem('bgs_returning_from_pro');
      if (v) sessionStorage.removeItem('bgs_returning_from_pro');
      return !!v;
    } catch (_) { return false; }
  })();

  const enteringDefaultPortfolioPath = (() => {
    try {
      const p = window.location.pathname || '';
      return /^\/default-mode(?:\/|\/index\.html)?$/i.test(p);
    } catch (_) {
      return false;
    }
  })();

  if (returningFromPro || enteringDefaultPortfolioPath) {
    try {
      // BIO: Splash / intro1 atlan璋媟 閳?Pro d鏋歯鐪夎墽鐪塶de intro2 zaten kokpite ge鑾絠lir; /default-mode/ i鑾絠nde ise yenilemede do鑷抮udan a鑷抋鑾?
      $intro.style.display = 'none';
      $splash.style.display = 'none';
      try {
        $splash.setAttribute('aria-hidden', 'true');
      } catch (_se) { /* BIO: ignore */ }
      $introVideo.style.display = 'none';
      videoEnded = true;
      try {
        $introVid.pause();
        $introVid.currentTime = 0;
      } catch (_) {}
      const playHandoffUfoIntro = !!returningFromPro;
      ufoPhotoRevealed = !playHandoffUfoIntro;
      try {
        renderRoot(true);
      } catch (_) {}
      siteReady = true;
      syncDefaultLandscapeHint();
      scheduleDefaultModeWarmup();
      gsap.to($mainVol, { opacity: 1, duration: 0.6, delay: 0.5 });
      if (playHandoffUfoIntro) {
        playUfoIntro();
      }
    } finally {
      document.documentElement.classList.remove('returning-from-pro');
    }
  } else {

  /* BIO: Implementation note for this section. */
  $splash.style.display = 'flex';
  try {
    $splash.removeAttribute('aria-hidden');
  } catch (_se) { /* BIO: ignore */ }
  $splash.style.opacity = '1';
  setTimeout(() => { $ifill.style.width = '100%'; }, 100);

  /* BIO: Implementation note for this section. */
  setTimeout(() => {
    gsap.to($intro, { opacity: 0, duration: 0.5, onComplete: () => { $intro.style.display = 'none'; } });

    gsap.fromTo('#splash-title',
      { opacity: 0, y: 30, scale: 0.95, filter: 'blur(6px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out', delay: 0.3 }
    );
    gsap.fromTo('#splash-sub',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, delay: 0.8 }
    );
    gsap.fromTo('#splash-line, #splash-line2',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 }
    );
    gsap.fromTo('#splash-start-wrap',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, delay: 1.2 }
    );
    gsap.fromTo('#splash-vol-wrap',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, delay: 1.0 }
    );
  }, 1400);

  } /* BIO: end k鏋歬 (/) ilk ziyaret splash; /default-mode/ y鐪塳lemesi 鐪塻t blokta k璋媠alt璋媗璋媟 */

  /* BIO: Button layout and interaction note. */
  function startSite() {
    testAudio.pause();
    testAudio.currentTime = 0;
    stopViz();
    if (splashIntentDirectPro) {
      try { startProModePayloadPrefetch(); } catch (_) { /* BIO: ignore */ }
    }
    $introVideo.style.display = 'flex';
    $introVideo.style.opacity = '1';
    $introVid.volume = globalVolume;
    $introVid.muted = false;

    const p = $introVid.play();
    if (p) p.catch(() => {
      $introVid.muted = true;
      $soundIcon.textContent = '棣冩敧';
      $soundLabel.textContent = 'SOUND OFF';
      $introVid.play();
    });

    gsap.to($splash, {
      opacity: 0, duration: 0.5, ease: 'power2.inOut',
      onComplete: () => {
        $splash.style.display = 'none';
        try {
          $splash.setAttribute('aria-hidden', 'true');
        } catch (_se) { /* BIO: ignore */ }
      }
    });

    setTimeout(() => {
      $introSkip.style.opacity = '1';
      $introSound.style.opacity = '1';
    }, 500);
  }

  const DETECT_GPU_SPLASH = 'https://esm.sh/detect-gpu@5.0.37';
  let splashGpuGateBusy = false;

  async function probeSplashGpuTier() {
    try {
      const m = await import(DETECT_GPU_SPLASH);
      if (typeof m.getGPUTier !== 'function') return null;
      const r = await m.getGPUTier();
      if (!r || r.tier === undefined || r.tier === null) return null;
      let t = r.tier;
      if (typeof t !== 'number') t = parseInt(String(t), 10);
      return Number.isFinite(t) ? t : null;
    } catch (_) {
      return null;
    }
  }

  /* BIO: Masa鐪塻t鐪? d鐪夎墽鐪塳 tier (<=1) 閳?uyar璋? Mobilde s璋媖 s璋媖 tier null oldu鑷抲ndan bilinmeyeni de uyar璋媦la ayn璋?yere ba鑷抣ar璋媧. */
  function shouldOpenSplashGpuWarnModal(tier) {
    const lowMeasured = tier !== null && tier <= 1;
    const unknownMob  = tier === null && IS_MOBILE;
    return lowMeasured || unknownMob;
  }

  function closeSplashGpuWarnModal() {
    const w = document.getElementById('splash-gpu-warn');
    if (!w) return;
    w.classList.remove('open');
    w.setAttribute('aria-hidden', 'true');
    splashGpuGateBusy = false;
    if ($splashStart) $splashStart.disabled = false;
  }

  function openSplashGpuWarnModal() {
    const w = document.getElementById('splash-gpu-warn');
    if (!w) return;
    paintSplashGpuWarnTexts(true);
    w.classList.add('open');
    w.setAttribute('aria-hidden', 'false');
    const bp = document.getElementById('sgw-pro');
    if (bp && typeof bp.focus === 'function') {
      requestAnimationFrame(() => {
        try {
          bp.focus();
        } catch (_) {}
      });
    }
  }

  const $sgwDef = document.getElementById('sgw-default');
  const $sgwPro = document.getElementById('sgw-pro');
  const $sgwBd = document.getElementById('sgw-backdrop');
  if ($sgwDef) {
    $sgwDef.addEventListener('click', () => {
      closeSplashGpuWarnModal();
      splashIntentDirectPro = false;
      startSite();
    });
  }
  if ($sgwPro) {
    $sgwPro.addEventListener('click', () => {
      closeSplashGpuWarnModal();
      splashIntentDirectPro = true;
      startSite();
    });
  }
  if ($sgwBd) {
    $sgwBd.addEventListener('click', () => {
      if ($sgwPro) $sgwPro.click();
    });
  }
  document.addEventListener('keydown', e => {
    const gw = document.getElementById('splash-gpu-warn');
    if (!gw || !gw.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      if ($sgwPro) $sgwPro.click();
    }
  });

  $splashStart.addEventListener('click', async () => {
    if (splashGpuGateBusy) return;
    splashGpuGateBusy = true;
    $splashStart.disabled = true;
    try {
      const tier = await probeSplashGpuTier();
      if (shouldOpenSplashGpuWarnModal(tier)) {
        openSplashGpuWarnModal();
        return;
      }
      splashIntentDirectPro = true;
      startSite();
    } catch (_) {
      splashIntentDirectPro = true;
      startSite();
    } finally {
      const gw = document.getElementById('splash-gpu-warn');
      if (!gw || !gw.classList.contains('open')) {
        splashGpuGateBusy = false;
        $splashStart.disabled = false;
      }
    }
  });

  /* BIO: UFO transition configuration note. */
  function endVideo() {
    if (videoEnded) return;
    videoEnded = true;

    const directPro = splashIntentDirectPro;
    if (directPro) splashIntentDirectPro = false;

    /* BIO: Direct Pro path: full-screen veil 閳?hiding #intro-video alone lets Main Tree paint for a frame before navigation. */
    if (directPro) {
      try {
        $introVid.pause();
        $introVid.currentTime = 0;
      } catch (_) {}
      try {
        gsap.killTweensOf($introVideo);
        gsap.killTweensOf($splash);
      } catch (_) {}
      /* BIO: z-index 499 #splash can sit above #intro-video during fade; kill it so nothing bleeds through the veil. */
      try {
        $splash.style.display = 'none';
        try {
          $splash.setAttribute('aria-hidden', 'true');
        } catch (_se) { /* BIO: ignore */ }
        $splash.style.opacity = '1';
      } catch (_) {}
      const hold = document.createElement('div');
      hold.id = 'bgs-direct-pro-nav-veil';
      hold.setAttribute('aria-hidden', 'true');
      hold.style.cssText =
        'position:fixed;inset:0;background:#000;z-index:2147483646;pointer-events:none';
      document.body.appendChild(hold);
      $introVideo.style.opacity = '1';
      $introVideo.style.display = 'none';
      requestAnimationFrame(() => {
        goToProModeDirect();
      });
      return;
    }

    gsap.to($introVideo, {
      opacity: 0, duration: .6, ease: 'power2.inOut',
      onComplete: () => {
        $introVideo.style.display = 'none';
        $introVid.pause();
        $introVid.currentTime = 0;

        renderRoot(true);
        siteReady = true;
        syncDefaultLandscapeHint();
        scheduleDefaultModeWarmup();
        gsap.to($mainVol, { opacity: 1, duration: 0.6, delay: 0.5 });
        playUfoIntro();
      }
    });
  }

  $introSkip.addEventListener('click', endVideo);
  $introVid.addEventListener('ended', endVideo);
  if ($introSound) {
    $introSound.addEventListener('click', () => {
      $introVid.muted = !$introVid.muted;
      if ($soundIcon)  $soundIcon.textContent  = $introVid.muted ? '棣冩敧' : '棣冩敯';
      if ($soundLabel) $soundLabel.textContent = $introVid.muted ? 'SOUND OFF' : 'SOUND';
    });
  }

  /* BIO: Audio, SFX, and mini-player behavior note. */
  const MUSIC_PLAYLIST = [
    { src: 'assets/default/music/track1.ogg', title: 'TRACK 01' },
    { src: 'assets/default/music/track2.ogg', title: 'TRACK 02' },
    { src: 'assets/default/music/track3.ogg', title: 'TRACK 03' }
  ];

  const $miniPlayer = document.getElementById('mini-player');
  const $mpPrev     = document.getElementById('mp-prev');
  const $mpPlay     = document.getElementById('mp-play');
  const $mpNext     = document.getElementById('mp-next');
  const $mpProgress = document.getElementById('mp-progress');
  const $mpFill     = document.getElementById('mp-progress-fill');
  const $mpSeek     = document.getElementById('mp-seek');
  const $mpCur      = document.getElementById('mp-cur');
  const $mpDur      = document.getElementById('mp-dur');
  const $mpIconPlay  = $mpPlay.querySelector('.mp-ico-play');
  const $mpIconPause = $mpPlay.querySelector('.mp-ico-pause');

  let mpIdx     = 0;
  let mpSeeking = false;

  /* BIO: Implementation note for this section. */
  let mpFadeTween = null;
  const MP_FADE_IN  = 0.2;
  const MP_FADE_OUT = 0.2;
  const mpFadeProxy = { v: 1 };   // BIO: 0 = silent, 1 = full (鑴?globalVolume)

  function mpApplyFadedVolume() {
    if (musicAudio) musicAudio.volume = Math.min(1, globalVolume * mpFadeProxy.v);
  }
  function mpFadeIn() {
    if (mpFadeTween) { mpFadeTween.kill(); mpFadeTween = null; }
    mpFadeProxy.v = 0;
    mpApplyFadedVolume();
    mpFadeTween = gsap.to(mpFadeProxy, {
      v: 1, duration: MP_FADE_IN, ease: 'power2.out',
      onUpdate: mpApplyFadedVolume,
      onComplete: () => { mpFadeTween = null; }
    });
  }
  function mpFadeOutThenPause() {
    if (mpFadeTween) { mpFadeTween.kill(); mpFadeTween = null; }
    mpFadeTween = gsap.to(mpFadeProxy, {
      v: 0, duration: MP_FADE_OUT, ease: 'power2.in',
      onUpdate: mpApplyFadedVolume,
      onComplete: () => {
        mpFadeTween = null;
        if (musicAudio && !musicAudio.paused) musicAudio.pause();
        mpFadeProxy.v = 1;
      }
    });
  }

  function mpFmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function mpEnsure() {
    if (musicAudio) return;
    musicAudio = new Audio();
    musicAudio.preload = 'metadata';
    musicAudio.volume  = globalVolume;
    musicAudio.addEventListener('timeupdate',     mpTick);
    musicAudio.addEventListener('loadedmetadata', mpTick);
    musicAudio.addEventListener('durationchange', mpTick);
    musicAudio.addEventListener('ended', () => mpLoad(mpIdx + 1, true));
    musicAudio.addEventListener('play', () => {
      $mpIconPlay.style.display  = 'none';
      $mpIconPause.style.display = '';
      $miniPlayer.classList.add('mp-playing');
    });
    musicAudio.addEventListener('pause', () => {
      $mpIconPlay.style.display  = '';
      $mpIconPause.style.display = 'none';
      $miniPlayer.classList.remove('mp-playing');
    });
    musicAudio.addEventListener('error', () => { /* BIO: track unavailable */ });
  }

  function mpLoad(i, autoplay) {
    mpEnsure();
    const n = MUSIC_PLAYLIST.length;
    mpIdx = ((i % n) + n) % n;
    const tr = MUSIC_PLAYLIST[mpIdx];
    musicAudio.src = tr.src;
    $mpFill.style.width = '0%';
    $mpCur.textContent  = '0:00';
    $mpDur.textContent  = '0:00';
    if (autoplay) {
      // BIO: Cancel any active fade and play at full volume (next/prev is instant)
      if (mpFadeTween) { mpFadeTween.kill(); mpFadeTween = null; }
      mpFadeProxy.v = 1;
      musicAudio.volume = globalVolume;
      const p = musicAudio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  }

  function mpToggle() {
    mpEnsure();

    // BIO: First time: load the current track before playing
    if (!musicAudio.src) mpLoad(mpIdx, false);

    if (musicAudio.paused) {
      // BIO: Fade-in
      if (mpFadeTween) { mpFadeTween.kill(); mpFadeTween = null; }
      mpFadeProxy.v = 0;
      mpApplyFadedVolume();
      const p = musicAudio.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      mpFadeIn();
    } else {
      // BIO: Fade-out then actually pause
      mpFadeOutThenPause();
    }
  }

  function mpTick() {
    if (!musicAudio) return;
    const cur = musicAudio.currentTime || 0;
    const dur = musicAudio.duration    || 0;
    if (!mpSeeking) {
      const pct = dur > 0 ? (cur / dur) * 100 : 0;
      $mpFill.style.width = pct + '%';
      if ($mpSeek && dur > 0) {
        $mpSeek.value = String(Math.round((cur / dur) * 1000));
      }
    }
    $mpCur.textContent = mpFmt(cur);
    $mpDur.textContent = mpFmt(dur);
    if ($mpSeek && musicAudio && isFinite(musicAudio.duration)) {
      const d0 = musicAudio.duration || 0;
      $mpSeek.setAttribute('aria-valuetext', mpFmt(cur) + ' / ' + mpFmt(d0));
    }
  }

  if ($mpSeek) {
    $mpSeek.addEventListener('input', () => {
      mpEnsure();
      if (!musicAudio || !isFinite(musicAudio.duration) || musicAudio.duration <= 0) return;
      const ratio = parseInt($mpSeek.value, 10) / 1000;
      $mpFill.style.width = (ratio * 100) + '%';
      try { musicAudio.currentTime = ratio * musicAudio.duration; } catch (_) {}
    });
    $mpSeek.addEventListener('pointerdown', () => { mpSeeking = true; });
    $mpSeek.addEventListener('pointerup', () => { mpSeeking = false; });
    $mpSeek.addEventListener('pointercancel', () => { mpSeeking = false; });
  }

  $mpPlay.addEventListener('click', mpToggle);
  $mpNext.addEventListener('click', () => mpLoad(mpIdx + 1, true));
  $mpPrev.addEventListener('click', () => {
    mpEnsure();
    if (musicAudio.src && musicAudio.currentTime > 3) {
      musicAudio.currentTime = 0;
    } else {
      mpLoad(mpIdx - 1, true);
    }
  });

  /* BIO: Pro Mode integration note. */
  let _mpWasPlayingBeforePro = false;
  window.pauseMusicForProConfirm = function () {
    if (musicAudio && !musicAudio.paused) {
      _mpWasPlayingBeforePro = true;
      mpFadeOutThenPause();
    } else {
      _mpWasPlayingBeforePro = false;
    }
  };
  window.resumeMusicForProConfirm = function () {
    if (!_mpWasPlayingBeforePro || !musicAudio) return;
    _mpWasPlayingBeforePro = false;
    if (mpFadeTween) { mpFadeTween.kill(); mpFadeTween = null; }
    mpFadeProxy.v = 0;
    mpApplyFadedVolume();
    const p = musicAudio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
    mpFadeIn();
  };
})();
