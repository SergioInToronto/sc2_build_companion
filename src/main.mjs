import { decodeSALT } from './salt.mjs';
import { renderResult } from './display.mjs';
import { initTimer, enableTimer } from './timer.mjs';

// ---------------------------------------------------------------------------
// Preset build orders (placeholders — replace SALT strings with real ones)
// ---------------------------------------------------------------------------
const PRESET_BUILDS = {
    terran: [
        { name: 'Standard Beginner Guide', salt: '$179524|spawningtool.com||~* 0 /+ F !, J ,/!9 )/!:" /!E #/!N /0"!!%0"!!%3"/ "3"2!%3"2!%6"6 !6"> !7"D!%7"D!%9"Q" :"W!%:"W!%=#* 0=#* />#/!%>#/!%>#1 0B#<#+E#D#0[$? ,[$? ,[$@ %^$K $b$X !b$X !f%1 *f%1#"f%4 .n%L ,n%M 0n%M )q&"!&q&"!&u&# 1u&*!$z&9!*' },
        { name: '2/1/1 Stim Timing', salt: '$201328|spawningtool.com||~) 0 /+ H !+ J ,0!:!(/!:" 0!F #0!T !1"  )1"# /2"/ ,3"; %4"Q" 8"[#+;#1 .>#9 *B#I /I$#!&I$#!&X$O #Z$Y  ]%%!#]%%!#]%%!#]%%!#]%%!#]%%!#]%(!Q' },
        { name: 'Easy MECH Build', salt: '$91078|spawningtool.com||~* 1 /+ H !, L ,/!;!(/!<" 0!M #0" !%2"" /3"/ %3"6 ,3"9 )5"J "6"Z" 6##!%6##!%9#& 1<#;!P<#> .?#C!%?#E ,B#J ,B#P /D$ !*I$* 2K$>#(M$>! Q$J!*V$W &W%" .Y%-! _%F 2_%M #a%X!!a%Y $g&%!!q&>  q&>  s\'!!!s\'% ,s\'% ,y\'*!!' },
    ],
    zerg: [
        { name: 'Standard Beginner Guide', salt: '$82510|spawningtool.com||~) +!?- T D-!! C.!4 I1""!?1"%!@1"%!@5"(#J5"*!C5"*!C<"P!?>"Y"#>#"!@@#* H?#, BD#C LD#C LF#W#@F#X#DF$" CF$" CF$(!AI$H!AI$H!AI$H!AI$H!AI$H!AV$T!AV$T!AV$T!AV$T!AV$Y D`%( Bf%< Cj%Q#@j%S#<j&* Es&2 Cs&2 C' },
        { name: '2 Base Muta', salt: '$119736|spawningtool.com||~) ,!?- S D.!( C-!- I1""!@1""!@7"\'!C7"*#J7"+!?8"C A:"F!@="L!@="Q!?H#4"#H#; CH#; CH#;!CH#;!CH#N"\'H#N"\'R$! BR$/ CR$/!CR$/!CV$9 KV$:!CV$:!CW$@!CW$@!CW$@!CY$M#=Y%  Db%;"\'b%;"\'b%;"\'b%;"\'a%L"\'a%L"\'a%M!>a%M!>a%M!>a%M!>a%M!>a%M!>a%M!>m%Y"\'m%Y"\'m& !>n&9!>n&9!>x&D!@' },
        { name: '1 Base Speedling Nydus', salt: '$98762|spawningtool.com||~) - C( 9 I* R!?*!+!C*!+!C*!+!C-!4!@/!<#J/!F!C1" "#1"!!?1"+!C2"6!C2"6!C3"A!C3"A!C3"A!C8"Z!?8"Z G;#D G?$" G' },
    ],
    protoss: [
        { name: 'Standard beginner Guide', salt: '$49802|spawningtool.com||~* 4 ;+ H 8, L 3/!7 9/!C 40!S ;2"+!S2"+#:5"A!K8"L!S8"Q 88"Q 8;"X 3>#+ ;?#-!SE#C =E#H @K$/#iK$/!SK$/!SK$/!SR$4 3R$4 3R$6!4V$D!SV$D!SZ$U!2`%* 8`%* 8`%* 8`%* 8a%4!Sd%;!2h%K 9' },
        { name: '8 Stalker Timing Attack', salt: '$104778|spawningtool.com||~* 0 ;+ D 8, O 3- W 3/!, 80!7 41!C ;2!U!82!U!83!W#:3"# ;8"9!88"9!8="W!8="W!8A#- 9A#N =A#S!SA#S!SF$% @D$5!SD$5!SI%/ 7' },
        { name: 'Stalker Colossus', salt: '$76092|spawningtool.com||~* 0 ;+ E 8, O 3. X 3/!/ 81!< 42!F ;3!Z#:4"%!84"%!89"1 ;:"C!8:"C!8>"Z 9>#2 =B$ !4E$* 8E$* 8F$5!2L$? <N$P!8Q$U!8T%  3T%  3T%%!4X%B 9Z%D!/Z%H#Ob%[!8b%[!8h&/ 7h&/ 7h&4!/r&I#3r&J#2x\'#!/' },
    ],
};

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
const track = document.getElementById('slider-track');

// Map screen index to translateX percentage of the track element.
// Track is 300% wide; each screen is 33.333% of the track = 100% of viewport.
// Shift by -33.333% per screen index to bring that screen into view.
const SCREEN_OFFSETS = ['0%', '-33.333%', '-66.667%'];

function navigateTo(index) {
    track.style.transform = `translateX(${SCREEN_OFFSETS[index]})`;
}

// ---------------------------------------------------------------------------
// Screen 2 state
// ---------------------------------------------------------------------------
const saltView   = document.getElementById('saltView');
const buildList  = document.getElementById('buildList');
const screen2Title = document.getElementById('screen2Title');

function showCustomView() {
    screen2Title.textContent = 'Enter SALT';
    saltView.style.display   = 'flex';
    buildList.style.display  = 'none';
}

function showBuildListView(race) {
    screen2Title.textContent = `${race} builds`;
    saltView.style.display   = 'none';
    buildList.style.display  = 'flex';

    // Populate list
    buildList.innerHTML = '';
    const builds = PRESET_BUILDS[race] ?? [];
    builds.forEach(build => {
        const li = document.createElement('li');
        li.className   = 'option-item';
        li.textContent = build.name;
        li.addEventListener('click', () => {
            loadBuildAndAdvance(build.salt);
        });
        buildList.appendChild(li);
    });
}

// ---------------------------------------------------------------------------
// Load a SALT string, render result, go to screen 3
// ---------------------------------------------------------------------------
function loadBuildAndAdvance(saltString) {
    const container = document.getElementById('result');
    try {
        const result = decodeSALT(saltString);
        renderResult(result, container);
        if (container.children.length > 0) {
            enableTimer();
        }
        navigateTo(2);
    } catch (err) {
        console.error('Failed to decode SALT:', err);
    }
}

// ---------------------------------------------------------------------------
// Screen 1: race/custom selection
// ---------------------------------------------------------------------------
document.getElementById('raceList').addEventListener('click', e => {
    const item = e.target.closest('.option-item');
    if (!item) return;
    const race = item.dataset.race;

    if (race === 'custom') {
        showCustomView();
    } else {
        showBuildListView(race);
    }
    navigateTo(1);
});

// ---------------------------------------------------------------------------
// Screen 2: SALT form submit
// ---------------------------------------------------------------------------
document.getElementById('saltForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('saltInput').value;
    loadBuildAndAdvance(input);
});

// ---------------------------------------------------------------------------
// Back buttons
// ---------------------------------------------------------------------------
document.getElementById('backToRace').addEventListener('click', () => navigateTo(0));
document.getElementById('backToSelect').addEventListener('click', () => navigateTo(1));

// ---------------------------------------------------------------------------
// Timer (elements are always in the DOM on screen 3)
// ---------------------------------------------------------------------------
initTimer();
