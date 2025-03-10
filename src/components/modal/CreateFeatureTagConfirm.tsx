import { ConfirmDialog, ConfirmDialogProps } from 'react-confirm';
import CreateFeatureTags, { CreateNodeProps, ResultValue } from '../osm/CreateFeatureTags';

type BaseProps = Omit<CreateNodeProps, "onClose" | "onSubmit" | "open">

type Props = ConfirmDialogProps<BaseProps, ResultValue | null>;

function DialogContent({ show, proceed, ...rest }: Props) {
    return <CreateFeatureTags
        open={show}
        {...rest}
        onClose={() => proceed(null)}
        onSubmit={proceed}
    />
}

export const CreateTagsConfirmation: ConfirmDialog<BaseProps, ResultValue | null> = (props) => (<DialogContent {...props} />);