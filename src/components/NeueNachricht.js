

export default function NeueNachricht(){



    return(
    <div className="neuenachricht container">
        <h2>Neue Nachricht:</h2>
        <form>
            <section>
                    <label htmlFor="empfaenger">An:</label>
                    <input className="form-input" type="text" id="empfaenger" name="empfaenger"/>
            </section>
            <section>
                    <label htmlFor="betreff">Betreff:</label>
                    <input className="form-input" type="text" id="betreff" name="betreff"/>
            </section>
            <section>
                    <label htmlFor="nachricht">Nachricht</label>
                    <textarea id="nachricht" name="nachricht"></textarea>
            </section>
            <section>
                    <div className="button-container"><button className="absenden-btn">absenden</button></div>
            </section>
        </form>
    </div>
    );
}