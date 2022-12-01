import _ from "lodash";
import React from "react";
import { HashRouter, Link, useLocation } from "react-router-dom";
import { Tonality } from "../src";
import { accidentals, allNotes, naturalNotes } from "../src/note";
import { allScales, majorScale } from "../src/scale";
import { allTunings, parseTuning } from "../src/tunings";
import { coerceColor, colorValue } from "../src/util";
import { Dropdown } from "./Dropdown";
import { ChordsPage } from "./pages/Chords";
import { FretboardPage } from "./pages/Fretboard";
import { PositionsPage } from "./pages/Positions";
import { Pill, PillButton } from "./Pill";
import { themes } from "./theme";
import { ThemeConsumer, ThemeProvider } from "./ThemeContext";
import { Tone } from "./Tone";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

type ScaleToolProps = {
  scale: string;
  keyCenter: string;
  tuning: string;
  theme?: string;
  tab?: string;
};

// TODO 1
const positions = [1];

export function getURLFromProps(props: ScaleToolProps) {
  return `?scale=${encodeURIComponent(props.scale)}&keyCenter=${encodeURIComponent(
    props.keyCenter
  )}&tuning=${encodeURIComponent(props.tuning)}&theme=${props.theme ?? "light"}${
    props.tab === undefined ? "" : `&tab=${props.tab}`
  }`;
}

export function parseCandidate(candidate: string) {
  try {
    return parseTuning(candidate);
  } catch {
    return undefined;
  }
}

function ScaleTool(props: ScaleToolProps) {
  const selectedScale = allScales.find((s) => s.name === props.scale) ?? majorScale;
  const keyCenter = allNotes.find((n) => n === props.keyCenter) ?? "E";
  const parsedTuning = parseCandidate(props.tuning);
  const selectedTuning =
    allTunings.find((t) => t.name === props.tuning) ??
    (parsedTuning === undefined
      ? allTunings[0]
      : {
          name: props.tuning,
          tones: parsedTuning,
        });
  const tonality: Tonality = {
    keyCenter: keyCenter,
    scale: selectedScale,
    tuning: selectedTuning,
  };
  const { name: selectedTheme, theme } = themes.find((x) => x.name === props.theme) ?? themes[0];

  // Do i even
  document.body.style.backgroundColor = colorValue(theme.backgroundColor);

  const [tab, setTab] = React.useState<string | undefined>("Fretboard");

  const Section = ({ children }: any) => {
    return (
      <>
        <div
          style={{
            marginTop: "15px",
            marginLeft: "15px",
            borderLeft: `5px solid ${colorValue(theme.primaryColor)}`,
            paddingLeft: "15px",
            paddingBottom: "10px",
          }}
          children={children}
        />
        <br />
      </>
    );
  };
  return (
    <ThemeProvider value={theme}>
      <ThemeConsumer>
        {(theme) => (
          <div
            style={{
              display: "inline-block",
              margin: 0,
              height: "inherit",
              width: "inherit",
              backgroundColor: colorValue(theme.backgroundColor),
              color: colorValue(theme.textColor),
            }}
          >
            <div style={{ display: "flex", padding: "20px" }}>
              <Dropdown title={selectedTheme}>
                {themes.map((selectTheme, key) => (
                  <div key={key} style={{ marginBottom: "5px" }}>
                    <Link to={getURLFromProps({ ...props, theme: selectTheme.name })}>
                      <Pill color={selectTheme.name === selectedTheme ? theme.secondaryColor : theme.primaryColor}>
                        {selectTheme.name}
                      </Pill>
                    </Link>
                  </div>
                ))}
              </Dropdown>
              <Dropdown title={tonality.tuning.name}>
                {allTunings.map((tuning, key) => (
                  <div key={key} style={{ marginBottom: "5px" }}>
                    <Link to={getURLFromProps({ ...props, tuning: tuning.name })}>
                      <Pill color={tuning.name === selectedTuning.name ? theme.secondaryColor : theme.primaryColor}>
                        {tuning.name}
                      </Pill>
                    </Link>
                  </div>
                ))}
              </Dropdown>
              <Dropdown title={tonality.scale.name}>
                {Object.entries(_.groupBy(allScales, (e) => e.key(keyCenter).scaleFormula.degrees)).map(
                  ([degrees, scales], key) => (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {scales.map((scale, scaleKey) => (
                        <Link to={getURLFromProps({ ...props, scale: scale.name })} key={`${key}${scaleKey}`}>
                          <div
                            style={{
                              display: "inline-block",
                              flexBasis: "initial",
                              marginTop: "10px",
                              borderRadius: "5px",
                              flexShrink: "0",
                              padding: "0 10px",
                              color: "white",
                              cursor: "pointer",
                              backgroundColor: colorValue(
                                scale.name === selectedScale.name ? theme.secondaryColor : theme.primaryColor
                              ),
                            }}
                          >
                            {scale.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )
                )}
              </Dropdown>
              <Dropdown title={tonality.keyCenter}>
                {[...naturalNotes, ...accidentals].map((note, key) => (
                  <Link to={getURLFromProps({ ...props, keyCenter: note })} key={key}>
                    <div
                      style={{
                        marginTop: "5px",
                        display: "inline-block",
                        cursor: "pointer",
                      }}
                    >
                      <Tone
                        color={colorValue(note === keyCenter ? theme.secondaryColor : theme.primaryColor)}
                        tone={`${note}0`}
                        showTone
                        border={`5px solid ${coerceColor(
                          colorValue(note === keyCenter ? theme.secondaryColor : theme.primaryColor)
                        ).lighten(0.3)}`}
                        includeOctave={false}
                      />
                    </div>
                  </Link>
                ))}
              </Dropdown>
              |&nbsp;
              <PillButton
                color={tab === "Fretboard" ? theme.secondaryColor : theme.neutralColor}
                onClick={() => setTab("Fretboard")}
              >
                Fretboard
              </PillButton>
              {/* <PillButton
                color={tab === "Positions" ? theme.secondaryColor : theme.neutralColor}
                onClick={() => setTab("Positions")}
              >
                Positions
              </PillButton> */}
              {/* <PillButton
                color={tab === "Chords" ? theme.secondaryColor : theme.neutralColor}
                onClick={() => setTab("Chords")}
              >
                Chords
              </PillButton> */}
            </div>

            {(() => {
              switch (tab) {
                case "Fretboard":
                  return <FretboardPage tonality={tonality} />;
                case "Positions":
                  return <PositionsPage positions={positions} tonality={tonality} />;
                case "Chords":
                  return <ChordsPage tonality={tonality} />;
              }
            })()}
          </div>
        )}
      </ThemeConsumer>
    </ThemeProvider>
  );
}

export function Main() {
  let query = useQuery();
  const inStorage = JSON.parse(localStorage.getItem("scale-props") ?? "{}");
  const keyCenter = query.get("keyCenter") ?? inStorage.keyCenter ?? "E";
  const tuning = query.get("tuning") ?? inStorage.tuning ?? allTunings[0].name;
  const scale = query.get("scale") ?? inStorage.scale ?? majorScale.name;
  const theme = query.get("theme") ?? inStorage.theme ?? undefined;
  const tab = query.get("tab") ?? undefined;
  React.useEffect(() => {
    localStorage.setItem(
      "scale-props",
      JSON.stringify(
        {
          keyCenter,
          tuning,
          scale,
          theme,
          tab,
        },
        null,
        0
      )
    );
  }, [query]);
  return <ScaleTool keyCenter={keyCenter} scale={scale} tuning={tuning} theme={theme} tab={tab} />;
}

export function App() {
  return (
    <HashRouter basename="/">
      <Main />
    </HashRouter>
  );
}
