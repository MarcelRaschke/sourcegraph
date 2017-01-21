import * as autobind from "autobind-decorator";
import * as React from "react";
import { Link } from "react-router";
import { marked } from "vs/base/common/marked/marked";
import URI from "vs/base/common/uri";

import { urlToBlobLineCol } from "sourcegraph/blob/routes";
import { FlexContainer } from "sourcegraph/components";
import { colors, typography, whitespace } from "sourcegraph/components/utils";
import { URIUtils } from "sourcegraph/core/uri";
import { DefinitionData } from "sourcegraph/util/RefsBackend";
import { RouterContext, prettifyRev } from "sourcegraph/workbench/utils";

interface Props {
	defData: DefinitionData;
}

interface State {
	showingFullDocString: boolean;
}

const DocStringLength = 50;

@autobind
export class DefinitionDocumentationHeader extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			showingFullDocString: false,
		};
	}

	private onToggleExpand(): void {
		this.setState({
			showingFullDocString: !this.state.showingFullDocString,
		});
	}

	render(): JSX.Element | null {
		const { defData } = this.props;
		const uri = URI.parse(defData.definition.uri);
		let {repo, rev, path} = URIUtils.repoParams(uri);
		rev = prettifyRev(rev);
		const {startLineNumber, startColumn} = defData.definition.range;
		const url = urlToBlobLineCol(repo, rev, path, startLineNumber + 1, startColumn + 1);
		const fullDocString = marked(defData.docString, { sanitize: true });
		let renderedDocString = fullDocString;
		if (fullDocString.length >= DocStringLength) {
			if (this.state.showingFullDocString) {
				renderedDocString = renderedDocString + `<a style="display: inline-block; padding-left: 5px;">   Hide...</a>`;
			} else {
				renderedDocString = renderedDocString.substr(0, DocStringLength);
				renderedDocString = renderedDocString + `<a style="display: inline-block; padding-left: 5px;">   More...</a>`;
			}
		}
		return <div>
			<div onClick={this.onToggleExpand} style={Object.assign({}, {
				maxHeight: "40vh",
				overflowY: "scroll",
				paddingLeft: whitespace[3],
				paddingRight: whitespace[3],
				color: colors.blueGrayD1(),
			}, typography[2])}
				dangerouslySetInnerHTML={{ __html: renderedDocString }}>
			</div>
			<div style={{ color: colors.blueGray(), paddingTop: whitespace[1], paddingLeft: whitespace[3], paddingRight: whitespace[3], paddingBottom: whitespace[2] }}>
				{`Defined in ${repo.replace(/^github.com\//, "")}`}
			</div>
			<FlexContainer content="stretch" justify="center" items="center">
				<RouterContext>
					<Link style={{ display: "flex", flex: "1 1 auto" }} to={url}>
						<button style={Object.assign({ fontWeight: typography.weight[2] }, {
							color: "#1893e7", display: "flex",
							flex: "1 1 auto",
							height: "40px",
							marginLeft: whitespace[3],
							marginRight: whitespace[3],
							borderRadius: "3px",
							backgroundColor: "#ffffff",
							justifyContent: "center",
							border: "solid 1px #c9d4e3"
						}, typography[3])}>Jump to definition →</button>
					</Link>
				</RouterContext>
			</FlexContainer>
		</div >;
	}
}
