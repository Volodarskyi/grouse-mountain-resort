import packageJson from "../../../package.json";
import { DevCreateUserForm } from "./DevCreateUserForm";
import { DevMenuTransferPanel } from "./DevMenuTransferPanel";
import { DevSeedPanel } from "./DevSeedPanel";
import { DevUsersList } from "./DevUsersList";
import "./DevPage.Styles.scss";

export default function DevPage() {
    return (
        <main className="dev-page">
            <h1>Dev</h1>
            <p className="dev-page__version">
                Application version: {packageJson.version}
            </p>
            <DevSeedPanel />
            <DevMenuTransferPanel />
            <DevCreateUserForm />
            <DevUsersList />
        </main>
    );
}
