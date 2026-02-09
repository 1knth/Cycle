import './LinkBank.css';
import PlaidLinkButton from './PlaidLinkButton.js'
import Card from '../cards/NumberCard.js';
import '../cards/dash-component.css';

function LinkAccount() {

    return (
        <section className="Link-Plaid-Container">
            <Card
                type="regular"
                name="link your transaction history." 
                data={<PlaidLinkButton/>}
                kpi="1500+ banks supported"
            />
        </section>
    )
}

export default LinkAccount;